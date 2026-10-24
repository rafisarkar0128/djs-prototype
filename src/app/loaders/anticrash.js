import chalk from 'chalk';
import readline from 'node:readline';
import process from 'node:process';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('ANTICRASH');

/**
 * Attaches process error traps and graceful exit handlers
 * @param {import("#core/client/BotClient.js").BotClient} client
 */
export function loadAnticrash(client) {
  log.info('AntiCrash system loaded.');

  let isExiting = false;

  /**
   * Graceful termination sequence
   * @param {string} signal
   */
  async function gracefulExit(signal) {
    if (process.stdout.isTTY) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }

    if (isExiting) {
      log.warn('Forced shutdown requested. Exiting immediately...');
      process.exit(1);
    }

    isExiting = true;
    log.warn(`Received ${chalk.bold(signal)}. Initiating graceful shutdown...`);

    // Fallback timer if network sockets or DB queries hang
    const forceExitTimer = setTimeout(() => {
      log.fatal('Graceful shutdown timed out (10s limit). Forcing exit.');
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();

    try {
      // 1. Destroy audio/player nodes if registered
      if (client.music?.destroy) {
        log.start('Disconnecting Lavalink nodes...');
        await client.music.destroy();
        log.success('Lavalink nodes disconnected.');
      }

      // 2. Destroy Discord Gateway WebSocket
      if (client.destroy) {
        log.start('Destroying Discord client connection...');
        await client.destroy();
        log.success('Discord client disconnected.');
      }

      // 3. Close database connection pool via IoC container/service locator
      const dbConnection = client.services?.get('DatabaseConnection');
      if (dbConnection?.close) {
        log.start('Closing database connection pool...');
        await dbConnection.close();
        log.success('Database connection pool closed.');
      }

      log.success('All services terminated cleanly.');
      process.exit(0);
    } catch (error) {
      log.fatal('Error occurred during graceful exit:', error);
      process.exit(1);
    }
  }

  // --- Process Termination Signals ---
  process.on('SIGINT', () => gracefulExit('SIGINT (Ctrl+C)'));
  process.on('SIGTERM', () => gracefulExit('SIGTERM'));
  process.on('SIGHUP', () => gracefulExit('SIGHUP'));

  // --- Windows Ctrl+C Workaround ---
  if (process.platform === 'win32') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on('SIGINT', () => {
      process.emit('SIGINT');
    });
  }

  // --- Error & Exception Trapping ---

  // Unhandled Promise Rejections (e.g. Discord API permission errors)
  process.on('unhandledRejection', (reason, _promise) => {
    log.error('Unhandled Promise Rejection:', reason);
  });

  // Catch unexpected synchronous errors to prevent the process from dropping
  process.on('uncaughtException', (error, origin) => {
    log.fatal(`Uncaught Exception (${origin}):`, error);
  });

  // Node runtime warnings (e.g. MaxListenersExceeded, deprecations)
  process.on('warning', (warning) => {
    log.warn(`[NodeWarning] ${warning.name}: ${warning.message}`);
  });
}
