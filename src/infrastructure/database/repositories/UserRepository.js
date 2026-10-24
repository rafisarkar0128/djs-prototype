import { BaseRepository } from '#infra/database/repositories/BaseRepository.js';
import { UserAccount } from '#modules/user/domain/entities/UserAccount.js';

export class UserRepository extends BaseRepository {
  /**
   * @param {import('mongodb').Db} db
   * @param {{ max?: number, ttl?: number }} [cacheOptions]
   */
  constructor(db, cacheOptions) {
    super(db.collection('Users'), cacheOptions);
  }

  toDomain(raw) {
    return new UserAccount({
      id: raw._id,
      username: raw.username,
      coins: raw.coins,
      bank: raw.bank,
      xp: raw.xp,
      level: raw.level,
      reputation: raw.reputation,
      daily: raw.daily,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  /**
   * Finds or provisions a user account record.
   * @param {string} userId
   * @param {string} [username]
   * @returns {Promise<UserAccount>}
   */
  async findOrCreate(userId, username = 'Unknown') {
    const existing = await this.findById(userId);
    if (existing) {
      if (existing.username !== username) {
        existing.username = username;
        await this.save(existing);
      }
      return existing;
    }

    const newUser = new UserAccount({
      id: userId,
      username,
    });

    await this.save(newUser);
    return newUser;
  }
}
