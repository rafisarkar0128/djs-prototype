import { ApplicationCommandType, Locale } from 'discord.js';

/**
 * Checks whether two localization maps differ.
 * @param {import('discord.js').LocalizationMap | null | undefined} oldLocales
 * @param {import('discord.js').LocalizationMap | null | undefined} newLocales
 * @returns {boolean}
 */
export function hasLocalizationChanged(oldLocales = {}, newLocales = {}) {
  const oldMap = oldLocales ?? {};
  const newMap = newLocales ?? {};

  for (const locale of Object.values(Locale)) {
    if ((oldMap[locale] ?? null) !== (newMap[locale] ?? null)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether choice arrays differ in value, name, or localizations.
 * @param {import('discord.js').ApplicationCommandOptionChoiceData[]} [oldChoices]
 * @param {import('discord.js').APIApplicationCommandOptionChoice[]} [newChoices]
 * @returns {boolean}
 */
export function haveChoicesChanged(oldChoices = [], newChoices = []) {
  const oldList = oldChoices ?? [];
  const newList = newChoices ?? [];

  if (oldList.length !== newList.length) return true;

  for (let i = 0; i < newList.length; i++) {
    const next = newList[i];
    // Choices can be looked up by identical value
    const prev = oldList.find((c) => c.value === next.value);

    if (!prev) return true;
    if (prev.name !== next.name) return true;
    if (hasLocalizationChanged(prev.nameLocalizations, next.name_localizations)) {
      return true;
    }
  }

  return false;
}

/**
 * Deeply checks for changes in command option hierarchies.
 * @param {import('discord.js').ApplicationCommandOption[]} [oldOptions]
 * @param {import('discord.js').APIApplicationCommandOption[]} [newOptions]
 * @returns {boolean}
 */
export function haveOptionsChanged(oldOptions = [], newOptions = []) {
  const oldList = oldOptions ?? [];
  const newList = newOptions ?? [];

  if (oldList.length !== newList.length) return true;

  for (const nextOpt of newList) {
    const prevOpt = oldList.find((opt) => opt.name === nextOpt.name);
    if (!prevOpt) return true;

    if (prevOpt.type !== nextOpt.type) return true;
    if (prevOpt.description !== nextOpt.description) return true;
    if ((prevOpt.required ?? false) !== (nextOpt.required ?? false)) return true;
    if ((prevOpt.autocomplete ?? false) !== (nextOpt.autocomplete ?? false)) return true;

    // String / Numeric Constraints
    if ((prevOpt.minLength ?? null) !== (nextOpt.min_length ?? null)) return true;
    if ((prevOpt.maxLength ?? null) !== (nextOpt.max_length ?? null)) return true;
    if ((prevOpt.minValue ?? null) !== (nextOpt.min_value ?? null)) return true;
    if ((prevOpt.maxValue ?? null) !== (nextOpt.max_value ?? null)) return true;

    // Localizations
    if (hasLocalizationChanged(prevOpt.nameLocalizations, nextOpt.name_localizations)) {
      return true;
    }
    if (
      hasLocalizationChanged(prevOpt.descriptionLocalizations, nextOpt.description_localizations)
    ) {
      return true;
    }

    // Channel Types Array
    const prevChannels = prevOpt.channelTypes ?? [];
    const nextChannels = nextOpt.channel_types ?? [];
    if (prevChannels.length !== nextChannels.length) return true;
    if (nextChannels.some((type) => !prevChannels.includes(type))) return true;

    // Option Choices
    if (haveChoicesChanged(prevOpt.choices, nextOpt.choices)) return true;

    // Subcommands / Subcommand Groups (Recursive)
    if (haveOptionsChanged(prevOpt.options, nextOpt.options)) return true;
  }

  return false;
}

/**
 * Compares an existing Discord REST Application Command with a locally loaded command.
 * Returns true if changes are detected and an API PUT/PATCH is required.
 *
 * @param {import('discord.js').ApplicationCommand} existingCommand Existing command from Discord Gateway/REST
 * @param {import('#infra/discord/BaseCommand.js').BaseCommand | any} localCommand In-memory loaded command
 * @returns {boolean} True if definition changed
 */
export function hasCommandChanged(existingCommand, localCommand) {
  const oldData = existingCommand;
  const newData =
    typeof localCommand.data.toJSON === 'function' ? localCommand.data.toJSON() : localCommand.data;

  // 1. Core Metadata
  if (oldData.name !== newData.name) return true;
  if (
    (oldData.type ?? ApplicationCommandType.ChatInput) !==
    (newData.type ?? ApplicationCommandType.ChatInput)
  ) {
    return true;
  }

  // 2. ChatInput-Specific Metadata (Context Menus do not have descriptions)
  if ((oldData.type ?? ApplicationCommandType.ChatInput) === ApplicationCommandType.ChatInput) {
    if ((oldData.description ?? '') !== (newData.description ?? '')) return true;

    if (
      hasLocalizationChanged(oldData.descriptionLocalizations, newData.description_localizations)
    ) {
      return true;
    }

    if (haveOptionsChanged(oldData.options, newData.options)) {
      return true;
    }
  }

  // 3. Name Localizations
  if (hasLocalizationChanged(oldData.nameLocalizations, newData.name_localizations)) {
    return true;
  }

  // 4. Default Member Permissions (Bitfield resolution)
  const oldPerms =
    oldData.defaultMemberPermissions ? oldData.defaultMemberPermissions.bitfield.toString() : null;
  const newPerms =
    newData.default_member_permissions ?
      BigInt(newData.default_member_permissions).toString()
    : null;

  if (oldPerms !== newPerms) return true;

  // 5. NSFW & DMPermission
  if ((oldData.nsfw ?? false) !== (newData.nsfw ?? false)) return true;

  // 6. Installation Contexts (User Apps vs Guild Apps)
  const oldContexts = oldData.contexts ?? [];
  const newContexts = newData.contexts ?? [];
  if (oldContexts.length !== newContexts.length) return true;
  if (newContexts.some((c) => !oldContexts.includes(c))) return true;

  // 7. Integration Types
  const oldIntegrations = oldData.integrationTypes ?? [];
  const newIntegrations = newData.integration_types ?? [];
  if (oldIntegrations.length !== newIntegrations.length) return true;
  if (newIntegrations.some((i) => !oldIntegrations.includes(i))) return true;

  return false;
}

export default hasCommandChanged;
