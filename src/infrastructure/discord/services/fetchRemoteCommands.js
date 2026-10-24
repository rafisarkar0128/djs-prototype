import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('COMMAND_SYNC');

/**
 * @typedef {Object} RemoteCommandRecord
 * @property {boolean} global Whether this command belongs to the global registry or a specific guild
 * @property {import("discord.js").ApplicationCommand} data Full ApplicationCommand object with all localizations and metadata
 */

/**
 * Fetches all remote Application Commands (global and dev guild) including full localization maps.
 *
 * @param {import("#core/client/BotClient.js").BotClient} client
 * @returns {Promise<RemoteCommandRecord[]>}
 */
export async function fetchRemoteCommands(client) {
  if (!client?.isReady()) {
    throw new Error('[CommandSync] Gateway client is not connected or not ready.');
  }

  const devGuildId = client.config.client.guildId;

  try {
    // Run global and guild fetches concurrently
    const [globalCommands, guildCommands] = await Promise.all([
      client.application.commands.fetch({ withLocalizations: true }),
      devGuildId ?
        client.application.commands
          .fetch({ guildId: devGuildId, withLocalizations: true })
          .catch((err) => {
            log.warn(`Could not fetch commands for guild "${devGuildId}": ${err.message}`);
            return null;
          })
      : Promise.resolve(null),
    ]);

    /** @type {RemoteCommandRecord[]} */
    const remoteCommands = [];

    for (const command of globalCommands.values()) {
      remoteCommands.push({ data: command, global: true });
    }

    if (guildCommands) {
      for (const command of guildCommands.values()) {
        remoteCommands.push({ data: command, global: false });
      }
    }

    return remoteCommands;
  } catch (error) {
    log.error('Failed to fetch remote application commands from Discord:', error);
    // Return empty array rather than undefined so caller loops don't hard crash
    return [];
  }
}

export default fetchRemoteCommands;
