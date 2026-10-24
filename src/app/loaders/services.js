import { Logger } from '#core/logger/Logger.js';
import { MemoryCooldownRepository } from '#infra/cache/MemoryCooldownRepository.js';
import { CooldownService } from '#app/services/CooldownService.js';
import { DatabaseClient } from '#infra/database/DatabaseClient.js';
import { GuildRepository } from '#infra/database/repositories/GuildRepository.js';
import { UserRepository } from '#infra/database/repositories/UserRepository.js';

const log = Logger.getLogger('SERVICES');

/**
 * Initializes and wires domain repositories and application services into the IoC container.
 * @param {import("#core/client/BotClient.js").BotClient} client
 * @returns {Promise<void>}
 */
export async function loadServices(client) {
  log.wait('Wiring domain repositories and application services...');

  try {
    // cooldownRepo and cooldownService are registered for use in command handlers or other services
    const cooldownRepo = new MemoryCooldownRepository();
    const cooldownService = new CooldownService(cooldownRepo);

    // databaseClient, guildRepository, and userRepository are registered for use in services that require database access
    const dbClient = new DatabaseClient(client.config);
    const db = await dbClient.connect();
    const guildRepository = new GuildRepository(db, client.config.cacheSettings.GuildRepository);
    const userRepository = new UserRepository(db, client.config.cacheSettings.UserRepository);

    client.registerService('database', dbClient);
    client.registerService('guildRepository', guildRepository);
    client.registerService('userRepository', userRepository);
    client.registerService('cooldownRepo', cooldownRepo);
    client.registerService('cooldownService', cooldownService);

    log.success('Domain services wired and registered successfully.');
  } catch (error) {
    log.fatal('Failed to wire application services:', error);
    throw error;
  }
}

export default loadServices;
