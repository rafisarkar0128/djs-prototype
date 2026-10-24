import { RESTEvents } from 'discord.js';

/**
 * @type {import('#infra/discord/types/events.d.ts').RestEvent<typeof RESTEvents.RateLimited>}
 */
export default {
  name: RESTEvents.RateLimited,
  rest: true,
  once: false,
  /**
   * `rateLimitData` is automatically typed as `import('discord.js').RateLimitData`
   */
  execute(client, rateLimitData) {
    client.logger.warn(`REST Rate limited on route ${rateLimitData.route}`);
  },
};
