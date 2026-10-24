import { EmbedBuilder, Events } from 'discord.js';
import { colors } from '#core/constants/colors.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('GUILD');

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.GuildDelete>}
 */
export default {
  name: Events.GuildDelete,
  description: 'Cleans up memory caches and records guild departure in the audit log.',
  once: false,
  async execute(client, guild) {
    if (!guild) return;

    // Evict or invalidate cached guild state
    try {
      const guildRepo = client.getService('guildRepository');
      if (guildRepo?.evict) {
        guildRepo.evict(guild.id);
      }
    } catch (error) {
      log.warn(`Could not evict cached settings for removed guild [${guild.id}]:`, error);
    }

    // Fetch owner with error fallback (bot may no longer have permissions)
    const owner = await guild.fetchOwner().catch(() => null);
    const ownerTag = owner?.user?.tag ?? 'Unknown User';

    // Construct removal audit embed
    const embed = new EmbedBuilder()
      .setColor(colors.Error ?? '#ED4245')
      .setAuthor({
        name: guild.name || 'Unknown Guild',
        iconURL: guild.iconURL({ extension: 'png' }) ?? undefined,
      })
      .setDescription(`**${guild.name}** has removed the bot.`)
      .setThumbnail(guild.iconURL({ extension: 'png', size: 1024 }))
      .addFields(
        { name: 'Owner', value: ownerTag, inline: true },
        {
          name: 'Members',
          value: (guild.memberCount ?? 'Unknown').toLocaleString(),
          inline: true,
        },
        {
          name: 'Created At',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: 'Removed At',
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true,
        },
        { name: 'ID', value: `\`${guild.id}\``, inline: true },
      )
      .setTimestamp();

    // Dispatch to audit log channel
    try {
      const logService = client.getService('discordLogService');
      if (logService) {
        await logService.send(embed, { type: 'general' });
      }
    } catch (error) {
      log.error('Failed to send guildDelete audit log:', error);
    }
  },
};
