import chalk from 'chalk';
import readline from 'node:readline';

/**
 * Attaches process error traps and graceful exit handlers
 * @param {import("#structures/index.js").BotClient} client
 */
export function antiCrash(client) {
  client.logger.info('AntiCrash system loaded.');

  let isExiting = false;

  /**
   * Graceful termination sequence
   * @param {string} signal
   */
  async function gracefulExit(signal) {
    // Wipe out the echoed '^C' from the console line
    if (process.stdout.isTTY) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }

    if (isExiting) {
      client.logger.warn('Forced shutdown requested. Exiting immediately...');
      process.exit(1);
    }

    isExiting = true;
    client.logger.warn(`Received ${chalk.bold(signal)}. Initiating graceful shutdown...`);

    // Fallback timer if socket cleanup hangs
    const forceExitTimer = setTimeout(() => {
      client.logger.error('Graceful shutdown timed out (10s limit). Forcing exit.');
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();

    try {
      if (client.destroy) {
        client.logger.star('Destroying Discord client connection...');
        await client.destroy().catch((err) => client.logger.error('Error destroying client:', err));
        client.logger.success('Discord client disconnected.');
      }

      // if (client.dbClient?.close) {
      //   client.logger.star('Closing MongoDB connections...');
      //   await client.dbClient.close();
      // }

      client.logger.success('All services terminated cleanly.');
      process.exit(0);
    } catch (error) {
      client.logger.error('Error occurred during graceful exit:', error);
      process.exit(1);
    }
  }

  // --- Process Termination Signals ---
  // SIGINT = Ctrl + C in terminal
  process.on('SIGINT', () => gracefulExit('SIGINT (Ctrl+C)'));
  // SIGTERM = Termination request from PM2, Docker, or Kubernetes
  process.on('SIGTERM', () => gracefulExit('SIGTERM'));
  // SIGHUP = Terminal window closed
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

  // Unhandled Promise Rejections (e.g., Discord API errors like Missing Permissions)
  process.on('unhandledRejection', (reason, promise) => {
    console.log(chalk.red('[AntiCrash] | [UnhandledRejection] ===================='));
    client.logger.error(reason);
    console.log(chalk.red('[AntiCrash] | [UnhandledRejection] ===================='));
  });

  // Observe uncaught exceptions before process crash
  process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(chalk.red(`[AntiCrash] | [UncaughtException (${origin})] =========`));
    client.logger.error(error);
    console.log(chalk.red('[AntiCrash] | [UncaughtException] ====================='));
  });

  // Node runtime warnings (e.g. MaxListenersExceeded, experimental features)
  process.on('warning', (warning) => {
    client.logger.warn(`[NodeWarning] ${warning.name}: ${warning.message}`);
  });
}
