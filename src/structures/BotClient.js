import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import Genius from 'genius-lyrics';

import { Logger } from './Logger.js';
import { Helpers } from '#helpers/index.js';
// import { validateConfig } from '../helpers/validator.js';
// import Utils from '../utils/Utils.js';
// import DatabaseManager from '#db/DatabaseManager.js';

import config from '#src/config.js';
import pkg from '#root/package.json' with { type: 'json' };
// import color from '#src/resources/colors.js';
// import emoji from '#src/resources/emojis.js';
// import * as resources from '#src/resources/index.js';
// import * as helpers from '#src/helpers/index.js';
// import * as handlers from '#src/handlers/index.js';

/**
 * The client for this bot.
 * @extends {Client}
 */
export class BotClient extends Client {
  config = config;
  pkg = pkg;

  // color = color;
  // emoji = emoji;
  // resources = resources;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Poll,
        Partials.PollAnswer,
        Partials.Reaction,
        Partials.SoundboardSound,
        Partials.ThreadMember,
        Partials.User,
      ],
      allowedMentions: {
        parse: ['users', 'roles', 'everyone'],
        repliedUser: false,
      },
      failIfNotExists: true,
    });

    /** @type {Collection<string, import("./BaseCommand.js")>} */
    this.commands = new Collection();

    /** @type {Collection<string, import("./BaseCommand.js")>} */
    this.contextMenus = new Collection();

    /** @type {import("discord.js").ApplicationCommandData[]} */
    this.applicationCommands = [];

    /** @type {Collection<string, Collection<string, string>>} */
    this.cooldowns = new Collection();

    this.helpers = new Helpers(this);
    // this.handlers = handlers;
    this.logger = new Logger({ scope: 'CLIENT', config: config.loggerConfig });
    // this.utils = new Utils(this);
    // this.db = new DatabaseManager(this);
  }

  async start() {
    try {
      this.helpers.loadWelcome();
      this.helpers.loadAntiCrash();
      // validateConfig(this);

      await this.helpers.loadLocales();
      // await this.helpers.loadEvents(this);
      // await this.helpers.loadCommands(this);

      await this.login(this.config.bot.token);
    } catch (error) {
      this.logger.fatal(`Error starting the bot: ${error.message}`);
      throw error;
    }
  }
}
