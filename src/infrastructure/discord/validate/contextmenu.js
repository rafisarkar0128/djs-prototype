import { ApplicationCommandType } from 'discord.js';
import { getInvalidPermissions } from '#constants';

/**
 * Validates a Context Menu definition object.
 * @param {any} context
 * @throws {TypeError | RangeError} If the context definition fails schema invariants
 */
export function validateContext(context) {
  if (!context || typeof context !== 'object') {
    throw new TypeError('Context menu definition must be an object.');
  }

  if (typeof context.name !== 'string' || context.name.trim().length === 0) {
    throw new TypeError('Context menu must have a valid non-empty string name.');
  }

  // Discord context menus do not require lowercase names (unlike slash commands)
  if (
    context.type !== ApplicationCommandType.User &&
    context.type !== ApplicationCommandType.Message
  ) {
    throw new TypeError(
      `Context "${context.name}": type must be ApplicationCommandType.User (2) or ApplicationCommandType.Message (3).`,
    );
  }

  if (typeof context.execute !== 'function') {
    throw new TypeError(`Context "${context.name}": execute handler must be a function.`);
  }

  if (context.cooldown != null && (typeof context.cooldown !== 'number' || context.cooldown < 0)) {
    throw new TypeError(`Context "${context.name}": cooldown must be a non-negative number.`);
  }

  // Validate User Permissions dynamically
  if (context.userPermissions) {
    if (!Array.isArray(context.userPermissions)) {
      throw new TypeError(
        `Context "${context.name}": userPermissions must be an array of strings.`,
      );
    }

    const invalid = getInvalidPermissions(context.userPermissions);
    if (invalid.length > 0) {
      throw new RangeError(
        `Context "${context.name}": declared invalid userPermissions: [${invalid.join(', ')}]`,
      );
    }
  }

  // Validate Bot Permissions dynamically
  if (context.botPermissions) {
    if (!Array.isArray(context.botPermissions)) {
      throw new TypeError(`Context "${context.name}": botPermissions must be an array of strings.`);
    }

    const invalid = getInvalidPermissions(context.botPermissions);
    if (invalid.length > 0) {
      throw new RangeError(
        `Context "${context.name}": declared invalid botPermissions: [${invalid.join(', ')}]`,
      );
    }
  }
}

export default validateContext;
