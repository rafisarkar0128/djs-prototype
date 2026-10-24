import { BaseRepository } from '#infra/database/repositories/BaseRepository.js';
import { GuildSettings } from '#modules/guild/domain/entities/GuildSettings.js';

export class GuildRepository extends BaseRepository {
  /**
   * @param {import('mongodb').Db} db
   * @param {{ max?: number, ttl?: number }} [cacheOptions]
   */
  constructor(db, cacheOptions) {
    super(db.collection('Guilds'), cacheOptions);
  }

  toDomain(raw) {
    return new GuildSettings({
      id: raw._id,
      name: raw.name,
      ownerId: raw.ownerId,
      locale: raw.locale,
      prefix: raw.prefix,
      rank: raw.rank,
      joinedAt: raw.joinedAt,
      leftAt: raw.leftAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * Retrieves an existing guild settings entity or initializes a new default one.
   * @param {string} guildId
   * @param {Partial<GuildSettings>} [defaults]
   * @returns {Promise<GuildSettings>}
   */
  async findOrCreate(guildId, defaults = {}) {
    const existing = await this.findById(guildId);
    if (existing) return existing;

    const newGuild = new GuildSettings({
      id: guildId,
      name: defaults.name ?? 'Unknown Guild',
      ownerId: defaults.ownerId ?? 'Unknown',
      locale: defaults.locale ?? 'en-US',
      prefix: defaults.prefix ?? '!',
      ...defaults,
    });

    await this.save(newGuild);
    return newGuild;
  }
}
