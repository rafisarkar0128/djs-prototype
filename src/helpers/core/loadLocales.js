import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

const localesDir = join(process.cwd(), 'src', 'locales');

/**
 * A function to load locales for the bot client using i18next.
 * @param {import("#structures/index.js").BotClient} client
 * @returns {Promise<void>}
 * @example
 * await client.helpers.loadLocales(client);
 */
export async function loadLocales(client) {
  /**
   * @type {i18next.InitOptions}
   */
  const i18nConfig = {
    showSupportNotice: false,
    initAsync: false,
    load: 'currentOnly',
    ns: ['commands', 'context', 'embeds', 'misc', 'handlers', 'player'],
    defaultNS: false,
    fallbackNS: false,
    fallbackLng: ['en-US'],
    lng: client.config.defaultLocale ?? 'en-US',
    interpolation: { escapeValue: false },
    preload: readdirSync(localesDir).filter((file) => {
      const isDirectory = lstatSync(join(localesDir, file)).isDirectory();
      const langFiles = readdirSync(join(localesDir, file));
      if (isDirectory && langFiles.length > 0) return true;
    }),
    backend: {
      loadPath: join(localesDir, '{{lng}}/{{ns}}.json'),
      addPath: join(localesDir, '{{lng}}/{{ns}}.missing.json'),
    },
  };

  // initializing i18next with i18next-fs-backend
  await i18next.use(Backend).init(i18nConfig);
  client.logger.info('Loaded locales successfully.');
}
