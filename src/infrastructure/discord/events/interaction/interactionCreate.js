import { Events, MessageFlags } from 'discord.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('INTERACTION');

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.InteractionCreate>}
 */
export default {
  name: Events.InteractionCreate,
  description:
    'Inbound gateway listener for all Discord interactions; delegates to specialized routers.',
  once: false,
  async execute(client, interaction) {
    const interactionRouter = client.getService('interactionRouter');

    try {
      // Slash / Chat Input Commands
      if (interaction.isChatInputCommand()) {
        if (interactionRouter?.handleSlash) {
          await interactionRouter.handleSlash(client, interaction);
        } else {
          const command = client.commands.get(interaction.commandName);
          if (!command) return;
          await command.execute(client, interaction);
        }
        return;
      }

      // Autocomplete Suggestions
      if (interaction.isAutocomplete()) {
        if (interactionRouter?.handleAutocomplete) {
          await interactionRouter.handleAutocomplete(client, interaction);
        } else {
          const command = client.commands.get(interaction.commandName);
          if (command?.autocomplete) {
            await command.autocomplete(client, interaction);
          }
        }
        return;
      }

      // User & Message Context Menus
      if (interaction.isContextMenuCommand()) {
        if (interactionRouter?.handleContext) {
          await interactionRouter.handleContext(client, interaction);
        } else {
          const contextMenu = client.contextMenus.get(interaction.commandName);
          if (!contextMenu) return;
          await contextMenu.execute(client, interaction);
        }
        return;
      }

      // Message Components (Buttons & Select Menus)
      if (interaction.isMessageComponent()) {
        await interactionRouter?.handleComponent?.(client, interaction);
        return;
      }

      // Modal Submissions
      if (interaction.isModalSubmit()) {
        await interactionRouter?.handleModal?.(client, interaction);
      }
    } catch (error) {
      log.error(`Unhandled error during interaction [${interaction.id}]:`, error);

      // Attempt to notify user if interaction was not acknowledged yet
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content: 'An error occurred while executing this command.',
            flags: MessageFlags.Ephemeral,
          })
          .catch(() => null);
      }
    }
  },
};
