/**
 * @typedef {Object} LanguageEntry
 * @property {string} locale BCP 47 language tag (e.g. 'en-US', 'bn')
 * @property {string} name International English name
 * @property {string} native Endonym / Native script representation
 */

/** @type {readonly LanguageEntry[]} */
export const LANGUAGES = Object.freeze([
  { locale: 'en-US', name: 'English (US)', native: 'English (US)' },
  { locale: 'en-GB', name: 'English (UK)', native: 'English (UK)' },
  { locale: 'bn', name: 'Bengali', native: 'বাংলা' },
  { locale: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { locale: 'da', name: 'Danish', native: 'Dansk' },
  { locale: 'de', name: 'German', native: 'Deutsch' },
  { locale: 'es-ES', name: 'Spanish', native: 'Español' },
  { locale: 'es-419', name: 'Spanish (LATAM)', native: 'Español (LATAM)' },
  { locale: 'fr', name: 'French', native: 'Français' },
  { locale: 'hr', name: 'Croatian', native: 'Hrvatski' },
  { locale: 'it', name: 'Italian', native: 'Italiano' },
  { locale: 'lt', name: 'Lithuanian', native: 'Lietuviškai' },
  { locale: 'hu', name: 'Hungarian', native: 'Magyar' },
  { locale: 'nl', name: 'Dutch', native: 'Nederlands' },
  { locale: 'no', name: 'Norwegian', native: 'Norsk' },
  { locale: 'pl', name: 'Polish', native: 'Polski' },
  { locale: 'pt-BR', name: 'Portuguese (Brazil)', native: 'Português (Brasil)' },
  { locale: 'ro', name: 'Romanian', native: 'Română' },
  { locale: 'fi', name: 'Finnish', native: 'Suomi' },
  { locale: 'sv-SE', name: 'Swedish', native: 'Svenska' },
  { locale: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { locale: 'tr', name: 'Turkish', native: 'Türkçe' },
  { locale: 'cs', name: 'Czech', native: 'Čeština' },
  { locale: 'el', name: 'Greek', native: 'Ελληνικά' },
  { locale: 'bg', name: 'Bulgarian', native: 'Български' },
  { locale: 'ru', name: 'Russian', native: 'Русский' },
  { locale: 'uk', name: 'Ukrainian', native: 'Українська' },
  { locale: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { locale: 'th', name: 'Thai', native: 'ไทย' },
  { locale: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
  { locale: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { locale: 'ja', name: 'Japanese', native: '日本語' },
  { locale: 'ko', name: 'Korean', native: '한국어' },
]);

/**
 * Fast O(1) indexed lookup map by locale tag.
 * @type {ReadonlyMap<string, LanguageEntry>}
 */
export const LANGUAGE_MAP = new Map(LANGUAGES.map((lang) => [lang.locale, lang]));

/**
 * Resolve a language entry by locale tag with fallback.
 * @param {string} locale
 * @returns {LanguageEntry | undefined}
 */
export function getLanguage(locale) {
  return LANGUAGE_MAP.get(locale);
}

export default LANGUAGES;
