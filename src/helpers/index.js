// export * from './discord/checkForChange.js';
// export * from './discord/fetchCommands.js';
// export * from './discord/getCooldown.js';
// export * from './discord/syncCommands.js';

import { antiCrash } from './core/antiCrash.js';
// export * from './core/loadCommands.js';
// export * from './core/loadEvents.js';
import { loadLocales } from './core/loadLocales.js';
import { loadWelcome } from './core/loadWelcome.js';
// export * from './core/validator.js';

/**
 * @class
 * @classdesc A class that contains helper functions for the bot client.
 * @param {import("#structures/index.js").BotClient} client - The bot client instance.
 * @example
 * const helpers = new Helpers(client);
 */
export class Helpers {
  /**
   * @param {import("#structures/index.js").BotClient} client
   */
  constructor(client) {
    this.client = client;
  }

  loadAntiCrash() {
    antiCrash(this.client);
  }

  async loadLocales() {
    await loadLocales(this.client);
  }

  loadWelcome() {
    loadWelcome(this.client);
  }

  //   async loadCommands() {
  //     await loadCommands(this.client);
  //   }

  //   async loadEvents() {
  //     await loadEvents(this.client);
  //   }
}
