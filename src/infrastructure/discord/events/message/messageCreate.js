import { Events } from 'discord.js';

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.MessageCreate>}
 */
export default {
  name: Events.MessageCreate,
  description:
    'Inbound gateway listener for text messages; dispatches mentions and legacy prefix commands.',
  once: false,
  async execute(client, message) {
    // Guard clauses: Ignore bots, webhooks, or empty payloads
    if (message.author.bot || message.webhookId) return;
    if (!message.content || message.content.length === 0) return;

    // Mention Handling (<@BOT_ID> or <@!BOT_ID>)
    const botMention = `<@${client.user.id}>`;
    const botNicknameMention = `<@!${client.user.id}>`;
    const trimmed = message.content.trim();

    if (trimmed === botMention || trimmed === botNicknameMention) {
      const messageRouter = client.getService('messageRouter');
      if (messageRouter) {
        await messageRouter.handleMention(client, message);
      } else {
        // Fallback default response if router service is not registered
        await message.reply({
          content: `Hello! My prefix is \`${client.config.client.prefix}\`. Use \`/help\` to view all slash commands.`,
        });
      }
      return;
    }

    // Prefix Command Handling (if enabled in domain configuration)
    const prefix = client.config.client.prefix;
    if (trimmed.startsWith(prefix)) {
      const commandRouter = client.getService('messageRouter');
      await commandRouter?.handlePrefix(client, message);
    }
  },
};
