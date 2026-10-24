/**
 * @typedef {Object} RankReward
 * @property {number} level
 * @property {string} roleId
 */

/**
 * @typedef {Object} RankConfig
 * @property {boolean} enabled
 * @property {string} message
 * @property {string | null} channelId
 * @property {RankReward[]} rewards
 */

/**
 * @typedef {Object} GuildSettingsProps
 * @property {string} id Discord Guild ID
 * @property {string} name
 * @property {string} ownerId
 * @property {string} locale
 * @property {string} prefix
 * @property {RankConfig} rank
 * @property {Date} joinedAt
 * @property {Date | null} [leftAt]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

export class GuildSettings {
  /** @type {string} */
  id;
  /** @type {string} */
  name;
  /** @type {string} */
  ownerId;
  /** @type {string} */
  locale;
  /** @type {string} */
  prefix;
  /** @type {RankConfig} */
  rank;
  /** @type {Date} */
  joinedAt;
  /** @type {Date | null} */
  leftAt;
  /** @type {Date} */
  createdAt;
  /** @type {Date} */
  updatedAt;

  /**
   * @param {GuildSettingsProps} props
   */
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.ownerId = props.ownerId;
    this.locale = props.locale ?? 'en-US';
    this.prefix = props.prefix ?? '!';
    this.rank = props.rank ?? {
      enabled: false,
      message: 'Congratulations {user}, you leveled up to {level}!',
      channelId: null,
      rewards: [],
    };
    this.joinedAt = props.joinedAt ?? new Date();
    this.leftAt = props.leftAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // --- Domain Methods (Encapsulated Business Logic) ---

  /**
   * Updates core guild identity metadata.
   * @param {string} name
   * @param {string} ownerId
   */
  syncIdentity(name, ownerId) {
    if (this.name !== name || this.ownerId !== ownerId) {
      this.name = name;
      this.ownerId = ownerId;
      this.updatedAt = new Date();
    }
  }

  /**
   * Updates default command prefix with invariant validation.
   * @param {string} newPrefix
   */
  changePrefix(newPrefix) {
    const trimmed = newPrefix.trim();
    if (!trimmed || trimmed.length > 5) {
      throw new Error('Prefix must be between 1 and 5 characters.');
    }
    this.prefix = trimmed;
    this.updatedAt = new Date();
  }

  /**
   * Serializes the domain entity for MongoDB persistence.
   * @returns {Record<string, any>}
   */
  toPersistence() {
    return {
      _id: this.id,
      name: this.name,
      ownerId: this.ownerId,
      locale: this.locale,
      prefix: this.prefix,
      rank: this.rank,
      joinedAt: this.joinedAt,
      leftAt: this.leftAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
