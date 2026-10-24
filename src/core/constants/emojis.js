/**
 * @file Enterprise Unicode & Discord Emoji Tokens
 */

const rawEmojis = {
  // System & Application Lifecycle
  system: {
    success: '✅',
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    loading: '🔄',
    wait: '⏳',
    arrowRight: '➡️',
    arrowLeft: '⬅️',
    arrowUp: '⬆️',
    arrowDown: '⬇️',
    trash: '🗑️',
    gear: '⚙️',
    slash: '⌨️',
    link: '🔗',
    channel: '💬',
  },

  // Pagination & Navigation Controls
  page: {
    first: '⏮️',
    previous: '◀️',
    next: '▶️',
    last: '⏭️',
    stop: '⏹️',
    refresh: '🔄',
  },

  // Moderation & Guild Management
  moderation: {
    shield: '🛡️',
    ban: '🔨',
    kick: '👢',
    mute: '🔇',
    timeout: '⏱️',
    warn: '⚠️',
    lock: '🔒',
    unlock: '🔓',
    audit: '📜',
  },

  // Badges & Roles
  badges: {
    bot: '🤖',
    owner: '👑',
    developer: '👨‍💻',
    supporter: '🛠️',
    booster: '🚀',
    partner: '🤝',
    voter: '🗳️',
    moderator: '👮',
    designer: '🎨',
    active: '🔥',
    vip: '💎',
    bugHunter: '🐛',
  },

  // Economy & User Data
  economy: {
    wallet: '👛',
    bank: '🏦',
    coin: '🪙',
    cash: '💵',
    card: '💳',
    gem: '💎',
  },

  // General Interactive & Mini-Games
  interaction: {
    heart: '❤️',
    star: '⭐',
    party: '🎉',
    gift: '🎁',
    rock: '🪨',
    paper: '📰',
    scissors: '✂️',
    pingPong: '🏓',
    eightBall: '🎱',
    clock: '⏰',
  },
};

export const emojis = Object.freeze({
  ...rawEmojis,

  /**
   * Resolves a custom emoji format if found, otherwise returns fallback Unicode.
   * @param {string} customId e.g. '<:custom:123456789>'
   * @param {string} fallback Unicode fallback emoji
   * @returns {string}
   */
  resolve(customId, fallback) {
    return customId?.trim() ? customId : fallback;
  },
});

export default emojis;
