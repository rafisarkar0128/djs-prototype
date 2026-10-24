import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('I18N');
const localesDir = join(process.cwd(), 'src/core/i18n/locales');

/**
 * Discovers existing namespace JSON files from the default locale directory
 * @param {string} defaultLocale
 * @returns {string[]}
 */
function discoverNamespaces(defaultLocale = 'en-US') {
  const defaultDir = join(localesDir, defaultLocale);
  if (!existsSync(defaultDir)) {
    return ['commands', 'context', 'embeds', 'misc', 'handlers', 'player'];
  }

  try {
    return readdirSync(defaultDir)
      .filter((file) => file.endsWith('.json') && !file.includes('.missing.'))
      .map((file) => file.replace('.json', ''));
  } catch {
    return ['commands', 'context', 'embeds', 'misc', 'handlers', 'player'];
  }
}

/**
 * Initializes and binds i18next translation resources for the client
 * @param {import("#core/client/BotClient.js").BotClient} client
 * @returns {Promise<typeof i18next>}
 * @example
 * await loadLocales(client);
 */
export async function loadLocales(client) {
  const defaultLocale = client.config.defaultLocale ?? 'en-US';
  const availableLocales = client.config.availableLocales ?? [defaultLocale];
  const namespaces = discoverNamespaces(defaultLocale);

  log.wait(`Initializing translation engine (${availableLocales.length} locales detected)...`);

  /** @type {import('i18next').InitOptions} */
  const i18nConfig = {
    showSupportNotice: false,
    initAsync: false,
    load: 'currentOnly',
    ns: namespaces,
    defaultNS: false,
    fallbackNS: false,
    fallbackLng: [defaultLocale],
    lng: defaultLocale,
    preload: availableLocales,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: join(localesDir, '{{lng}}/{{ns}}.json'),
      addPath: join(localesDir, '{{lng}}/{{ns}}.missing.json'),
    },
  };

  try {
    const i18n = createInstance();
    await i18n.use(Backend).init(i18nConfig);

    // Register i18next instance into client's IoC container
    client.registerService('i18n', i18n);

    log.success(`Loaded locales successfully: [${availableLocales.join(', ')}]`);
    return i18n;
  } catch (error) {
    log.error('Failed to initialize localization backend:', error);
    throw error;
  }
}

export default loadLocales;
