import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { ServerApiVersion } from 'mongodb';
import pkg from '#root/package.json' with { type: 'json' };

const isDev = process.env.NODE_ENV === 'development';
const localesDir = join(process.cwd(), 'src/core/i18n/locales');

/**
 * Safely discover non-empty locale directories.
 * @returns {string[]}
 */
function getAvailableLocales() {
  if (!existsSync(localesDir)) return ['en-US'];
  try {
    const entries = readdirSync(localesDir, { withFileTypes: true });
    const locales = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => readdirSync(join(localesDir, name)).length > 0);

    return locales.length > 0 ? locales : ['en-US'];
  } catch {
    return ['en-US'];
  }
}

/**
 * Safely parse developer user IDs from JSON array or comma-separated string.
 * @param {string | undefined} raw
 * @returns {string[]}
 */
function parseDevIds(raw) {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }
  return trimmed
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Parse `LOG_SCOPES="DB:debug,AUTH:warn"` into `{ DB: 'debug', AUTH: 'warn' }`.
 * @param {string | undefined} envStr
 * @returns {Record<string, string>}
 */
function parseScopeLevels(envStr = '') {
  const map = {};
  for (const part of envStr.split(',')) {
    const [scope, level] = part.trim().split(':');
    if (scope && level) {
      map[scope.toUpperCase()] = level.toLowerCase();
    }
  }
  return map;
}

/**
 * Parse `LOG_SCOPE_COLORS="BOOTSTRAP:magentaBright,SERVICES:greenBright"` into a mapping.
 * @param {string | undefined} envStr
 * @returns {Record<string, string>}
 */
function parseScopeColors(envStr = '') {
  const map = {};
  for (const part of envStr.split(',')) {
    const [scope, color] = part.trim().split(':');
    if (scope && color) {
      map[scope.toUpperCase()] = color;
    }
  }
  return map;
}

/**
 * Parse boolean environment variables with fallback.
 * @param {string | undefined} val
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
const envBool = (val, defaultValue) => (val != null ? val.toLowerCase() === 'true' : defaultValue);

/**
 * Recursively freezes an object and all nested children.
 * @template T
 * @param {T} object
 * @returns {Readonly<T>}
 */
function deepFreeze(object) {
  for (const value of Object.values(object)) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const sysConfig = {
  env: isDev ? 'development' : 'production',
  isDev,
  debug: isDev,

  defaultLocale: process.env.DEFAULT_LOCALE ?? 'en-US',
  availableLocales: getAvailableLocales(),

  logger: {
    // Severity & Scope Filtering
    level: (process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info')).toLowerCase(),
    scopeLevels: parseScopeLevels(process.env.LOG_SCOPES),

    // Scope Color Theme (Env var overrides built-in presets)
    defaultScopeColor: process.env.LOG_DEFAULT_SCOPE_COLOR ?? 'magenta',
    scopeColors: {
      BOOTSTRAP: 'magentaBright',
      CONFIG: 'yellowBright',
      SERVICES: 'greenBright',
      EVENTS_LOADER: 'blueBright',
      COMMANDS_LOADER: 'cyanBright',
      ANTICRASH: 'redBright',
      I18N: 'cyan',
      GATEWAY: 'green',
      REST: 'magenta',
      ...parseScopeColors(process.env.LOG_SCOPE_COLORS),
    },

    // File Logging & Formats
    toFile: envBool(process.env.LOG_TO_FILE, !isDev),
    logDirPath: process.env.LOG_DIR_PATH ?? join(process.cwd(), 'logs'),
    dateFormat: process.env.LOG_DATE_FORMAT ?? '[dd/MM/yyyy]',
    timeFormat: process.env.LOG_TIME_FORMAT ?? '[h:mm:ss a]',

    // Display Toggles
    displayDate: envBool(process.env.LOG_DISPLAY_DATE, !isDev),
    displayTime: envBool(process.env.LOG_DISPLAY_TIME, true),
    displayScope: envBool(process.env.LOG_DISPLAY_SCOPE, true),
    displayFile: envBool(process.env.LOG_DISPLAY_FILE, isDev),
    displayBadge: envBool(process.env.LOG_DISPLAY_BADGE, true),
    displayLabel: envBool(process.env.LOG_DISPLAY_LABEL, true),
    uppercaseLabel: envBool(process.env.LOG_UPPERCASE_LABEL, true),
  },

  showTable: {
    event: envBool(process.env.SHOW_TABLE_EVENT, false),
    command: envBool(process.env.SHOW_TABLE_COMMAND, false),
  },

  client: {
    id: process.env.DISCORD_CLIENT_ID,
    token: process.env.DISCORD_CLIENT_TOKEN,
    secret: process.env.DISCORD_CLIENT_SECRET,
    ownerId: process.env.DISCORD_CLIENT_OWNER_ID,
    guildId: process.env.DISCORD_CLIENT_GUILD_ID,
    prefix: process.env.DISCORD_CLIENT_DEFAULT_PREFIX ?? '!',
    devIds: parseDevIds(process.env.DISCORD_CLIENT_DEV_IDS),
    global: envBool(process.env.DISCORD_CLIENT_GLOBAL_COMMANDS, false),
    allowedInvite: envBool(process.env.DISCORD_CLIENT_ALLOWED_INVITE, true),
    defaultCooldown: Number.parseInt(process.env.DISCORD_CLIENT_DEFAULT_COOLDOWN ?? '5', 10),
    showSyncLogs: envBool(process.env.SHOW_SYNC_LOGS, true),
    footer: `developed by ${pkg.author ?? 'the developer'}`,
  },

  database: {
    uri: process.env.MONGO_URI,
    options: {
      dbName: process.env.MONGO_DB_NAME ?? 'djs-prototype',
      serverSelectionTimeoutMS: 5000,
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    },
  },

  cacheSettings: {
    GuildRepository: {
      max: Number.parseInt(process.env.CACHE_GUILD_MAX ?? '25000', 10),
    },
    UserRepository: {
      max: Number.parseInt(process.env.CACHE_USER_MAX ?? '50000', 10),
    },
  },

  logs: {
    general: {
      color: '#36393F',
      channel: process.env.CHANNEL_GENERAL,
    },
    error: {
      color: '#de5d5d',
      channel: process.env.CHANNEL_ERROR,
    },
    command: {
      color: '#7289DA',
      channel: process.env.CHANNEL_COMMAND,
    },
  },

  links: {
    botWebsite: process.env.BOT_WEBSITE,
    githubRepo: process.env.GITHUB_REPO,
    supportServer: process.env.SUPPORT_SERVER,
  },
};

export default deepFreeze(sysConfig);
