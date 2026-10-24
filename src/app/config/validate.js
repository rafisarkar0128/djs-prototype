import chalk from 'chalk';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('CONFIG');

/**
 * Validates the core system configuration at bootstrap.
 * @param {typeof import('./index.js').default} config
 * @throws {Error} if critical credentials or paths are missing
 */
export function validateConfig(config) {
  const envFile = chalk.cyanBright('.env');
  const missing = [];

  // 1. Critical Bot Credentials
  if (!config.client.token) missing.push('DISCORD_CLIENT_TOKEN');
  if (!config.client.id) missing.push('DISCORD_CLIENT_ID');
  if (!config.client.guildId) missing.push('DISCORD_CLIENT_GUILD_ID');
  if (!config.client.ownerId) missing.push('DISCORD_CLIENT_OWNER_ID');
  if (!config.database.uri) missing.push('MONGO_URI');

  if (missing.length > 0) {
    const keys = missing.map((k) => chalk.yellow(k)).join(', ');
    throw new Error(`Missing mandatory environment variables in ${envFile}: ${keys}`);
  }

  // 2. Fallbacks & Informational Warnings
  if (!config.client.devIds || config.client.devIds.length === 0) {
    log.warn(`DEV_IDS in ${envFile} is empty. Developer bypass commands will be disabled.`);
  }

  if (!config.defaultLocale) {
    log.warn(`DEFAULT_LOCALE in ${envFile} is not set. Defaulting to 'en-US'.`);
    config.defaultLocale = 'en-US';
  } else if (!config.availableLocales.includes(config.defaultLocale)) {
    log.warn(
      `DEFAULT_LOCALE '${config.defaultLocale}' is not present in discovered locales. Falling back to 'en-US'.`,
    );
    config.defaultLocale = 'en-US';
  }

  if (!config.links?.supportServer) {
    log.warn(`SUPPORT_SERVER link is empty in ${envFile}.`);
  }

  log.success('Application configuration verified.');
}

export default validateConfig;
