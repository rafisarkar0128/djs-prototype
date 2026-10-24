import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

/**
 * Type-safe Union of all valid discord.js Permission string keys.
 * @typedef {keyof typeof PermissionFlagsBits} PermissionString
 */

/**
 * Master array containing all valid permission string keys, derived directly from discord.js.
 * @type {readonly PermissionString[]}
 */
export const permissions = Object.freeze(
  /** @type {PermissionString[]} */ (Object.keys(PermissionFlagsBits)),
);

/**
 * Fast O(1) lookup set for instant membership checks during validation.
 * @type {ReadonlySet<string>}
 */
export const VALID_PERMISSIONS = new Set(permissions);

/**
 * Validates permission keys defined on a command.
 * @param {string[]} perms Candidate permission strings to validate.
 * @returns {string[]} List of typo'd or invalid permission names (empty if all valid).
 * @example
 * const invalid = getInvalidPermissions(['SendMessages', 'ManageChennels']);
 * // returns ['ManageChennels']
 */
export function getInvalidPermissions(perms = []) {
  if (!Array.isArray(perms)) return [];
  return perms.filter((perm) => !VALID_PERMISSIONS.has(perm));
}

/**
 * Validates and converts an array of permission string names into a BigInt bitfield.
 * Throws a descriptive validation error if unknown permissions are passed.
 * @param {PermissionString[]} perms
 * @param {string} [contextName] Command or context name for error traceability.
 * @returns {bigint} Resolvable permission bitfield.
 */
export function resolvePermissions(perms = [], contextName = 'Command') {
  const invalid = getInvalidPermissions(perms);

  if (invalid.length > 0) {
    throw new TypeError(
      `[PermissionValidator] Invalid permissions declared in ${contextName}: [${invalid.join(', ')}]`,
    );
  }

  return PermissionsBitField.resolve(perms);
}

export default permissions;
