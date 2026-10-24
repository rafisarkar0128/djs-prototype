import { ActivityType, Events } from 'discord.js';
import chalk from 'chalk';
import { syncCommands } from '#infra/discord/services/syncCommands.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('READY');

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.ClientReady>}
 */
export default {
  name: Events.ClientReady,
  description:
    'Initializes post-connection infrastructure adapters, command sync, and presence rotations.',
  once: true,
  async execute(client) {
    log.success(`Ready! ${chalk.green(client.user.tag)} is online`);

    try {
      await syncCommands(client);
    } catch (error) {
      log.error('Failed to synchronize slash commands with Discord API:', error);
    }

    const getActivities = () => [
      {
        name: 'Slash Commands',
        type: ActivityType.Listening,
      },
      {
        name: `Over ${client.guilds.cache.size.toLocaleString()} servers`,
        type: ActivityType.Watching,
      },
      {
        name: `With ${client.guilds.cache
          .reduce((total, guild) => total + guild.memberCount, 0)
          .toLocaleString()} users`,
        type: ActivityType.Playing,
      },
      {
        name: '/help',
        type: ActivityType.Listening,
      },
    ];

    let activityIndex = 0;

    const rotatePresence = () => {
      const activities = getActivities();
      const currentActivity = activities[activityIndex];

      client.user.setPresence({
        status: 'online',
        activities: [currentActivity],
      });

      activityIndex = (activityIndex + 1) % activities.length;
    };

    // Apply presence immediately at startup, then rotate every 5 minutes
    rotatePresence();
    setInterval(rotatePresence, 300_000).unref();
  },
};
