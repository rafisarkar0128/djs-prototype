import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Logger } from '#core/logger/Logger.js';
import config from '#app/config/index.js';
import pkg from '#root/package.json' with { type: 'json' };

/**
 * Enterprise Composition Root and Discord Gateway Adapter.
 * @augments {Client}
 */
export class BotClient extends Client {
  /** @type {typeof config} */
  config = config;

  /** @type {typeof pkg} */
  pkg = pkg;

  /**
   * Enterprise Inversion-of-Control (IoC) Service Container.
   * Holds application use cases, repositories, and domain services.
   * @type {Map<string, any>}
   */
  services = new Map();

  /**
   * Inbound Command Registry (Slash & Message)
   * @type {Collection<string, import("#infra/discord/BaseCommand.js").BaseCommand>}
   */
  commands = new Collection();

  /**
   * Inbound Context Menu Registry (User & Message)
   * @type {Collection<string, any>}
   */
  contextMenus = new Collection();

  /**
   * Discord Application Command Payloads ready for REST registration
   * @type {import("discord.js").ApplicationCommandData[]}
   */
  applicationCommands = [];

  /**
   * Active command execution cooldowns
   * @type {Collection<string, Collection<string, number>>}
   */
  cooldowns = new Collection();

  /**
   * Unified Enterprise Logger Instance
   */
  logger = Logger.getLogger('GATEWAY');

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
  }

  /**
   * Register a dependency into the IoC container
   * @template T
   * @param {string} token
   * @param {T} instance
   * @returns {this}
   */
  registerService(token, instance) {
    this.services.set(token, instance);
    return this;
  }

  /**
   * Resolve a dependency from the IoC container
   * @template T
   * @param {string} token
   * @returns {T}
   */
  getService(token) {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`[ServiceLocator] Service '${token}' is not registered in the container.`);
    }
    return service;
  }
}
