import { EmbedBuilder, Events } from 'discord.js';
import { colors } from '#core/constants/colors.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('MODERATION');

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.GuildBanAdd>}
 */
export default {
  name: Events.GuildBanAdd,
  description:
    'Inbound gateway listener for guild bans; sends a DM notification to the banned member.',
  once: false,
  async execute(client, ban) {
    if (!ban || ban.user.bot) return;

    // Construct user notice embed
    const embed = new EmbedBuilder()
      .setTitle('Banned Notification')
      .setColor(colors.Error ?? '#ED4245')
      .setDescription(
        [
          `<@${ban.user.id}>, you have been banned from **${ban.guild.name}**.`,
          `**Reason:** ${ban.reason ?? 'No reason was provided.'}`,
        ].join('\n'),
      )
      .setThumbnail(ban.guild.iconURL({ extension: 'png', size: 1024 }))
      .setTimestamp();

    // Attempt to DM the member (silently swallow DM-closed errors)
    await ban.user.send({ embeds: [embed] }).catch(() => {
      log.debug(`Could not deliver ban DM to user [${ban.user.id}] (DMs closed or blocked).`);
    });

    // Optional: Delegate to moderation audit service
    const moderationService = client.getService('moderationService');
    if (moderationService?.handleExternalBan) {
      await moderationService.handleExternalBan(ban);
    }
  },
};
