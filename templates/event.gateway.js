import { Events } from 'discord.js';

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.MessageCreate>}
 */
export default {
  name: Events.MessageCreate,
  once: false,
  /**
   * `message` is automatically typed as `import('discord.js').Message`
   */
  async execute(client, message) {
    if (message.author.bot) return;

    // Execution logic here
  },
};
