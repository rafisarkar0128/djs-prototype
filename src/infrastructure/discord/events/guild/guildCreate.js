import { EmbedBuilder, Events } from 'discord.js';
import { colors } from '#core/constants/colors.js';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('GUILD');

/**
 * @type {import('#infra/discord/types/events.d.ts').GatewayEvent<typeof Events.GuildCreate>}
 */
export default {
  name: Events.GuildCreate,
  description:
    'Provisions new guild records and broadcasts a guild-join embed to the audit log channel.',
  once: false,
  async execute(client, guild) {
    if (!guild?.available) return;

    // Domain persistence via repository
    try {
      const guildRepo = client.getService('guildRepository');
      if (guildRepo) {
        await guildRepo.findOrCreate(guild.id);
      }
    } catch (error) {
      log.error(`Failed to initialize repository data for guild [${guild.id}]:`, error);
    }

    // Resolve guild owner safely
    const owner = await guild.fetchOwner().catch(() => null);
    const ownerName = owner ? owner.user.username : 'Unknown Owner';

    // Format audit embed
    const embed = new EmbedBuilder()
      .setColor(colors.Success ?? '#57F287')
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ extension: 'png' }) ?? undefined,
      })
      .setDescription(`**${guild.name}** has been added to my guilds.`)
      .setThumbnail(guild.iconURL({ extension: 'png', size: 1024 }))
      .addFields(
        { name: 'Owner', value: ownerName, inline: true },
        { name: 'Members', value: guild.memberCount.toLocaleString(), inline: true },
        {
          name: 'Created At',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: 'Joined At',
          value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:R>`,
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
      log.error('Failed to send guildCreate audit log:', error);
    }
  },
};
