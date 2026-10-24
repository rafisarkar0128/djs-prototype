/**
 * @typedef {Object} DailyStats
 * @property {number} streak
 * @property {boolean} claimed
 * @property {number} amount
 * @property {number} bonus
 * @property {Date | null} lastClaimed
 */

/**
 * @typedef {Object} ReputationStats
 * @property {number} received
 * @property {number} given
 * @property {Date | null} lastGiven
 */

/**
 * @typedef {Object} UserAccountProps
 * @property {string} id Discord User Snowflake ID
 * @property {string} username
 * @property {number} [coins]
 * @property {number} [bank]
 * @property {number} [xp]
 * @property {number} [level]
 * @property {ReputationStats} [reputation]
 * @property {DailyStats} [daily]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

export class UserAccount {
  /** @type {string} */
  id;
  /** @type {string} */
  username;
  /** @type {number} */
  coins;
  /** @type {number} */
  bank;
  /** @type {number} */
  xp;
  /** @type {number} */
  level;
  /** @type {ReputationStats} */
  reputation;
  /** @type {DailyStats} */
  daily;
  /** @type {Date} */
  createdAt;
  /** @type {Date} */
  updatedAt;

  /**
   * @param {UserAccountProps} props
   */
  constructor(props) {
    this.id = props.id;
    this.username = props.username;
    this.coins = props.coins ?? 0;
    this.bank = props.bank ?? 0;
    this.xp = props.xp ?? 0;
    this.level = props.level ?? 0;
    this.reputation = props.reputation ?? {
      received: 0,
      given: 0,
      lastGiven: null,
    };
    this.daily = props.daily ?? {
      streak: 0,
      claimed: false,
      amount: 0,
      bonus: 0,
      lastClaimed: null,
    };
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // --- Domain Logic ---

  /**
   * Adds experience and calculates level progression.
   * @param {number} amount
   * @returns {boolean} True if the user leveled up
   */
  addXp(amount) {
    if (amount <= 0) return false;
    this.xp += amount;
    this.updatedAt = new Date();

    const nextLevel = Math.floor(0.1 * Math.sqrt(this.xp));
    if (nextLevel > this.level) {
      this.level = nextLevel;
      return true;
    }
    return false;
  }

  toPersistence() {
    return {
      _id: this.id,
      username: this.username,
      coins: this.coins,
      bank: this.bank,
      xp: this.xp,
      level: this.level,
      reputation: this.reputation,
      daily: this.daily,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
