export class CooldownService {
  /**
   * @param {import('#infra/cache/MemoryCooldownRepository.js').MemoryCooldownRepository} cooldownRepo
   */
  constructor(cooldownRepo) {
    this.repo = cooldownRepo;
  }

  /**
   * Checks if a command execution is on cooldown.
   * If on cooldown, returns remaining milliseconds.
   * If NOT on cooldown, registers the execution and returns 0.
   *
   * @param {import('#infra/discord/BaseCommand.js').BaseCommand | any} command
   * @param {import('discord.js').User} user
   * @param {import('#core/client/BotClient.js').BotClient} client
   * @returns {{ onCooldown: boolean, remainingMs: number, expiresAt: number }}
   */
  checkAndApply(command, user, client) {
    const cooldownDuration = command.cooldown ?? 0;

    // 1. Business Rule: Zero cooldown commands bypass check
    if (cooldownDuration <= 0) {
      return { onCooldown: false, remainingMs: 0, expiresAt: 0 };
    }

    // 2. Business Rule: Developers/Owners bypass all cooldowns
    const devIds = client.config.client.devIds ?? [];
    if (client.config.client.ownerId === user.id || devIds.includes(user.id)) {
      return { onCooldown: false, remainingMs: 0, expiresAt: 0 };
    }

    const commandName = command.data.name;
    const expiresAt = this.repo.get(commandName, user.id);
    const now = Date.now();

    // 3. User is actively on cooldown
    if (expiresAt && now < expiresAt) {
      return {
        onCooldown: true,
        remainingMs: expiresAt - now,
        expiresAt,
      };
    }

    // 4. Cooldown expired or not set -> Apply new cooldown
    this.repo.set(commandName, user.id, cooldownDuration);
    return {
      onCooldown: false,
      remainingMs: 0,
      expiresAt: now + cooldownDuration * 1000,
    };
  }

  /**
   * Reset cooldown manually (e.g. if command validation fails midway)
   * @param {string} commandName
   * @param {string} userId
   */
  reset(commandName, userId) {
    this.repo.delete(commandName, userId);
  }
}

export default CooldownService;
