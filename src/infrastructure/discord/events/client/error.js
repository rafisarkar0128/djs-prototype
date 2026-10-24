import { Events } from 'discord.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('GATEWAY', {
  scopeColor: 'redBright',
});

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.Error>}
 */
export default {
  name: Events.Error,
  description:
    'Handles uncaught gateway errors emitted by the Discord client, logging them for debugging and monitoring purposes.',
  once: false,
  /**
   * @param {import('#core/client/BotClient.js').BotClient} client
   * @param {Error} error The error emitted by the Discord client gateway
   */
  async execute(client, error) {
    const wsStatus = client.ws?.status;
    log.error(`Discord Gateway client error encountered (WS Status: ${wsStatus}):`, error);
  },
};
