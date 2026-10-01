import * as pkg from '#root/package.json' with { type: 'json' };
import { readdirSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { ServerApiVersion } from 'mongodb';

// Resolve locales directory relative to this config file
const localesDir = join(import.meta.dirname, 'locales');

export default {
  // default language
  defaultLocale: process.env.DEFAULT_LOCALE ?? 'en-US',

  // Available languages for the bot
  availableLocales: readdirSync(localesDir).filter((file) => {
    const fullPath = join(localesDir, file);
    return lstatSync(fullPath).isDirectory() && readdirSync(fullPath).length > 0;
  }),

  // Logging settings
  loggerConfig: {
    level: process.env.LOG_LEVEL ?? 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    logDirPath: process.env.LOG_DIR_PATH ?? './logs/',
    dateFormat: process.env.LOG_DATE_FORMAT ?? '[dd/MM/yyyy]',
    timeFormat: process.env.LOG_TIME_FORMAT ?? '[h:mm:ss a]',
    displayScope: process.env.LOG_DISPLAY_SCOPE === 'true',
    displayFileName: process.env.LOG_DISPLAY_FILENAME === 'true',
    displayBadge: process.env.LOG_DISPLAY_BADGE !== 'false',
    displayLabel: process.env.LOG_DISPLAY_LABEL !== 'false',
    uppercaseLabel: process.env.LOG_UPPERCASE_LABEL !== 'false',
  },

  // whether to show table or not
  showTable: {
    event: false, // event loader table
    command: false, // command loader table
  },

  // Bot settings
  bot: {
    id: process.env.DISCORD_CLIENT_ID, // your bot's id
    token: process.env.DISCORD_CLIENT_TOKEN, // your bot's token
    secret: process.env.DISCORD_CLIENT_SECRET, // your bot's secret
    ownerId: process.env.OWNER_ID, // your discord account id
    guildId: process.env.GUILD_ID, // your guild id
    prefix: process.env.DEFAULT_PREFIX, // default prefix
    /** @type {string[]} */
    devs: process.env.DEV_IDS ? JSON.parse(process.env.DEV_IDS) : [],
    global: false, // Whether to make commands global or not
    allowedInvite: true, // Whether to allow invite command or not
    defaultCooldown: 5, // Default cooldown amount in seconds
    showSyncLogs: true, // Command synchronization logs
    footer: `developed by ${pkg.author ?? 'the developer'}`, // default footer for embeds
  },

  // MongoDB URI
  mongodbUri: process.env.MONGO_URI,

  /**
   * MongoDB Client options
   * @type {import("mongodb").MongoClientOptions}
   */
  mongodbOptions: {
    dbName: 'test',
    timeoutMS: 10000,
    connectTimeoutMS: 30000,
    directConnection: false,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
    },
  },

  /**
   * Cache settings for various managers
   * @type {Object<string, import("lru-cache").LRUCache>}
   */
  cacheSettings: {
    GuildManager: {
      max: 25000,
    },
    UserManager: {
      max: 50000,
    },
  },

  // Log channel config
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

  // Global images
  images: {
    glitch: 'https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png',
  },

  // Global icons
  icons: {
    youtube: 'https://i.imgur.com/xzVHhFY.png',
    spotify: 'https://i.imgur.com/qvdqtsc.png',
    soundcloud: 'https://i.imgur.com/MVnJ7mj.png',
    applemusic: 'https://i.imgur.com/Wi0oyYm.png',
    deezer: 'https://i.imgur.com/xyZ43FG.png',
    jiosaavn: 'https://i.imgur.com/N9Nt80h.png',
  },

  // Global links
  links: {
    botWebsite: process.env.BOT_WEBSITE,
    supportServer: process.env.SUPPORT_SERVER,
    githubRepo: 'https://github.com/theassassin0128/Node#readme',
  },
};
