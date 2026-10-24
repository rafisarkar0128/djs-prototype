import chalk from 'chalk';
import { ApplicationCommandType } from 'discord.js';
import { Logger } from '#core/logger/Logger.js';
import { fetchRemoteCommands } from '#infra/discord/services/fetchRemoteCommands.js';
import { hasCommandChanged } from '#infra/discord/utils/commandDiff.js';

const log = Logger.getLogger('COMMAND_SYNC');

/**
 * Creates a unique composite key for Discord command routing.
 * Accounts for identical names across different ApplicationCommandTypes and scopes.
 *
 * @param {number} type ApplicationCommandType
 * @param {string} name Command name
 * @param {boolean} isGlobal Guild vs Global scope
 * @returns {string} e.g. "1:ban:true"
 */
function toCompositeKey(type, name, isGlobal) {
  return `${type ?? ApplicationCommandType.ChatInput}:${name}:${Boolean(isGlobal)}`;
}

/**
 * Synchronizes local in-memory commands and context menus with Discord's REST API.
 * Uses atomic overwrite for production or empty states, and granular updates for development.
 *
 * @param {import("#core/client/BotClient.js").BotClient} client
 * @returns {Promise<void>}
 */
export async function syncCommands(client) {
  const guildId = client.config.client.guildId;
  const showSyncLogs = client.config.client.showSyncLogs ?? true;
  const isDev = client.config.isDev ?? client.config.env === 'development';

  // 1. Aggregate all local commands (Slash + Context Menus)
  const localItems = [...client.commands.values(), ...client.contextMenus.values()];

  const remoteCommands = await fetchRemoteCommands(client);

  // 2. Initial / Empty Remote State OR Production Mode -> Fast Atomic Set
  if (remoteCommands.length === 0 || !isDev) {
    log.start(`Publishing atomic command state (${localItems.length} items)...`);

    const globalPayloads = [];
    const guildPayloads = [];

    for (const item of localItems) {
      const payload = typeof item.data.toJSON === 'function' ? item.data.toJSON() : item.data;
      if (item.global) {
        globalPayloads.push(payload);
      } else {
        guildPayloads.push(payload);
      }
    }

    try {
      if (guildId && guildPayloads.length > 0) {
        await client.application.commands.set(guildPayloads, guildId);
      }
      await client.application.commands.set(globalPayloads);

      log.success('Successfully synchronized all application commands atomically.');
    } catch (error) {
      log.fatal('Failed to execute atomic command synchronization:', error);
    }
    return;
  }

  // 3. Development Mode: Granular Diffing (Create, Edit, Delete)
  /** @type {Map<string, any>} */
  const localMap = new Map();
  for (const item of localItems) {
    const type = item.data.type ?? ApplicationCommandType.ChatInput;
    localMap.set(toCompositeKey(type, item.data.name, item.global), item);
  }

  /** @type {Map<string, import('#infra/discord/services/fetchRemoteCommands.js').RemoteCommandRecord>} */
  const remoteMap = new Map();
  for (const remote of remoteCommands) {
    const type = remote.data.type ?? ApplicationCommandType.ChatInput;
    remoteMap.set(toCompositeKey(type, remote.data.name, remote.global), remote);
  }

  // --- PASS A: Identify & Delete Obsolete Remote Commands ---
  const deletions = [];

  for (const [key, remoteRecord] of remoteMap) {
    if (!localMap.has(key)) {
      deletions.push(
        remoteRecord.data
          .delete()
          .then(() => {
            if (showSyncLogs) {
              log.info(
                `[${chalk.redBright('DELETED')}] ${remoteRecord.global ? 'Global' : 'Guild'} command: ${chalk.cyanBright(remoteRecord.data.name)}`,
              );
            }
          })
          .catch((error) => {
            log.error(`Failed to delete obsolete command "${remoteRecord.data.name}":`, error);
          }),
      );
    }
  }

  if (deletions.length > 0) {
    await Promise.allSettled(deletions);
  }

  // --- PASS B: Create New Commands or Edit Changed Ones (Lines 100-145) ---
  const mutations = [];

  for (const [key, localItem] of localMap) {
    const remoteRecord = remoteMap.get(key);
    const payload =
      typeof localItem.data.toJSON === 'function' ? localItem.data.toJSON() : localItem.data;

    // Command does not exist on Discord -> Create
    if (!remoteRecord) {
      const createAction =
        localItem.global ? client.application.commands.create(payload)
        : guildId ? client.application.commands.create(payload, guildId)
        : null;

      if (createAction) {
        mutations.push(
          createAction
            .then(() => {
              if (showSyncLogs) {
                log.info(
                  `[${chalk.greenBright('ADDED')}] ${localItem.global ? 'Global' : 'Guild'} command: ${chalk.cyanBright(localItem.data.name)}`,
                );
              }
            })
            .catch((error) => {
              log.error(`Failed to create command "${localItem.data.name}":`, error);
            }),
        );
      }
      continue;
    }

    // Command exists remotely -> Check for diffs and patch in place
    if (hasCommandChanged(remoteRecord.data, localItem)) {
      mutations.push(
        remoteRecord.data
          .edit(payload)
          .then(() => {
            if (showSyncLogs) {
              log.info(
                `[${chalk.yellowBright('MODIFIED')}] ${localItem.global ? 'Global' : 'Guild'} command: ${chalk.cyanBright(localItem.data.name)}`,
              );
            }
          })
          .catch((error) => {
            log.error(`Failed to update command "${localItem.data.name}":`, error);
          }),
      );
    }
  }

  if (mutations.length > 0) {
    await Promise.allSettled(mutations);
  }

  log.success('Application command synchronization cycle completed.');
}

export default syncCommands;
