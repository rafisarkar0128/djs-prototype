// oxlint-disable-next-line import/no-unassigned-import
import 'dotenv/config';
import process from 'node:process';
import sysConfig from '#app/config/index.js';
import { validateConfig } from '#app/config/validate.js';
import { BotClient } from '#core/client/BotClient.js';
import { Logger } from '#core/logger/Logger.js';
import { printBanner } from '#app/bootstrap/banner.js';

// Loaders
import { loadAnticrash } from '#app/loaders/anticrash.js';
import { loadServices } from '#app/loaders/services.js';
import { loadLocales } from '#app/loaders/locales.js';
// import { loadCommands } from '#app/loaders/commands.js';
import { loadEvents } from '#app/loaders/events.js';

const log = Logger.getLogger('BOOTSTRAP', {
  config: {
    level: 'debug',
  },
});

if (process.stdout.isTTY) {
  console.clear();
}

async function bootstrap() {
  // 1. Startup Visual Banner
  printBanner();

  // 2. Fail-fast configuration validation
  validateConfig(sysConfig);

  // 3. Instantiate Domain Container / Client
  const client = new BotClient(sysConfig);

  // 4. Attach Process Safety & Crash Traps
  loadAnticrash(client);

  // 5. Wire Repositories & Domain Services into IoC
  await loadServices(client);

  // 6. Load Global Locales (i18n Domain)
  await loadLocales(client);

  // 7. Discover & Register Event Listeners
  await loadEvents(client);

  // 8. Discover & Register Commands / Context Menus
  // await loadCommands(client);

  // 9. Connect to Discord Gateway
  log.start('Connecting to Discord Gateway...');
  await client.login(client.config.client.token);
  log.success('Discord Gateway session established.');
}

bootstrap().catch((error) => {
  log.fatal('Application bootstrap sequence failed:', error);
  process.exit(1);
});
