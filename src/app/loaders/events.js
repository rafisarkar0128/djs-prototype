import chalk from 'chalk';
import { Events, RESTEvents } from 'discord.js';
import { table } from 'table';
import { Logger } from '#core/logger/Logger.js';
import { loadFilesAsUrls } from '#app/loaders/files.js';

const log = Logger.getLogger('EVENTS_LOADER');

/**
 * Fast lookup sets for valid Discord Gateway and REST event names.
 */
const VALID_GATEWAY_EVENTS = new Set(Object.values(Events));
const VALID_REST_EVENTS = new Set(Object.values(RESTEvents));

/**
 * Discovers, validates, and registers Discord Gateway and REST event listeners.
 *
 * @param {import("#core/client/BotClient.js").BotClient} client
 * @returns {Promise<void>}
 */
export async function loadEvents(client) {
  const fileUrls = await loadFilesAsUrls('#infra/discord/events/', ['.js']);
  const showTable = client.config.showTable?.event ?? false;

  const tableData = [['Event', 'Target', 'Type', 'Status']];
  const tableConfig = {
    columnDefault: { alignment: 'center' },
    drawHorizontalLine: (lineIndex, rowCount) =>
      lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount,
    columns: [
      { alignment: 'left' },
      { alignment: 'center' },
      { alignment: 'center' },
      { width: 8, alignment: 'center' },
    ],
  };

  let loadedCount = 0;

  for (const fileUrl of fileUrls) {
    const fileName = fileUrl.split('/').pop() ?? 'unknown.js';

    try {
      // oxlint-disable-next-line no-await-in-loop
      const module = await import(fileUrl);
      const EventClassOrObject = module.default ?? module;

      // Support either exported class instances (new Event()) or standard object exports
      const event =
        typeof EventClassOrObject === 'function' ? new EventClassOrObject() : EventClassOrObject;

      if (!event || typeof event !== 'object') {
        throw new TypeError('Exported event module must be an object or a constructible class.');
      }

      if (event.disabled) {
        tableData.push([chalk.gray(event.name ?? fileName), 'N/A', 'N/A', chalk.gray('SKIPPED')]);
        continue;
      }

      if (!event.name || typeof event.name !== 'string') {
        throw new TypeError('Event "name" must be a non-empty string.');
      }

      if (typeof event.execute !== 'function') {
        throw new TypeError(`Event "${event.name}" is missing an executable "execute" function.`);
      }

      // Determine listener target: REST or Gateway (client)
      const isRest = Boolean(event.rest);
      const targetEmitter = isRest ? client.rest : client;
      const validEventSet = isRest ? VALID_REST_EVENTS : VALID_GATEWAY_EVENTS;

      if (!validEventSet.has(event.name)) {
        throw new RangeError(
          `"${event.name}" is not a recognized Discord.js ${isRest ? 'REST' : 'Gateway'} event name.`,
        );
      }

      const listenerMethod = event.once ? 'once' : 'on';
      targetEmitter[listenerMethod](event.name, (...args) => event.execute(client, ...args));

      loadedCount++;
      tableData.push([
        chalk.yellow(event.name),
        isRest ? chalk.magenta('REST') : chalk.cyan('CLIENT'),
        event.once ? chalk.blue('ONCE') : chalk.green('ON'),
        '» 🌱 «',
      ]);
    } catch (error) {
      log.error(`Failed to register event file "${fileName}":`, error);
      tableData.push([chalk.red(fileName), 'ERROR', 'ERROR', '» 🔴 «']);
    }
  }

  if (showTable && tableData.length > 1) {
    console.log(table(tableData, tableConfig));
  }

  log.success(`Registered ${chalk.yellow(loadedCount)} event listeners successfully.`);
}

export default loadEvents;
