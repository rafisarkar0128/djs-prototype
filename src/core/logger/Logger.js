import chalk from 'chalk';
import figures from 'figures';
import { DateTime } from 'luxon';
import { appendFileSync, mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, stripVTControlCharacters } from 'node:util';
import process from 'node:process';
import sysConfig from '#app/config/index.js';

const { grey } = chalk;

/**
 * Applies chalk style safely using a named chalk color or a hex code.
 * @param {string} text
 * @param {string} [colorSpec]
 * @returns {string}
 */
function colorize(text, colorSpec = 'magenta') {
  if (!colorSpec) return text;
  if (colorSpec.startsWith('#')) {
    return chalk.hex(colorSpec)(text);
  }
  return typeof chalk[colorSpec] === 'function' ? chalk[colorSpec](text) : text;
}

/**
 * @typedef {'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'} LogLevel
 */

/**
 * Filter chalk keys to string property names, excluding function internals like 'constructor' or symbols
 * @typedef {Extract<keyof typeof import('chalk').default, string>} ChalkColor
 */

/**
 * @typedef {Object} LoggerConfig
 * @property {string} [dateFormat] Luxon date format string (e.g. '[dd/MM/yyyy]')
 * @property {string} [timeFormat] Luxon time format string (e.g. '[h:mm:ss a]')
 * @property {boolean} [toFile] Whether to write logs to disk
 * @property {string} [logDirPath] Destination directory for log files
 * @property {LogLevel} [level] Minimum threshold severity tier
 * @property {string} [defaultScopeColor] Fallback color for scope badges
 * @property {Record<string, string>} [scopeColors] Per-scope color palette
 * @property {boolean} [displayDate] Toggle date prefix in console output
 * @property {boolean} [displayTime] Toggle time prefix in console output
 * @property {boolean} [displayScope] Toggle [SCOPE] badge
 * @property {boolean} [displayFile] Toggle origin file name badge
 * @property {boolean} [displayBadge] Toggle figure icon/badge
 * @property {boolean} [displayLabel] Toggle level label text
 * @property {boolean} [uppercaseLabel] Whether label text is rendered uppercase
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [scope] Scope shown in the log prefix (defaults to 'MAIN')
 * @property {string} [scopeColor] Chalk color or hex code for the scope badge
 * @property {string} [fileColor] Chalk color or hex code for the origin file badge
 * @property {Partial<LoggerConfig>} [config] Instance-specific display toggles
 */

/**
 * SLF4J-style numeric severity rankings.
 * Lower number = more verbose; higher number = more severe.
 */
export const LEVEL_RANKS = Object.freeze({
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: 100,
});

/**
 * Immutable global baseline default configuration.
 */
export const DEFAULT_LOGGER_CONFIG = Object.freeze({
  dateFormat: '[dd/MM/yyyy]',
  timeFormat: '[h:mm:ss a]',
  toFile: false,
  logDirPath: join(process.cwd(), 'logs'),
  level: 'info',
  defaultScopeColor: 'magenta',
  displayDate: true,
  displayTime: true,
  displayScope: true,
  displayFile: false,
  displayBadge: true,
  displayLabel: true,
  uppercaseLabel: true,
});

/**
 * @typedef {Object} LogType
 * @property {string} badge The symbol of the log
 * @property {keyof chalk} color The color for the label
 * @property {string} label The label of the log
 * @property {keyof typeof LEVEL_RANKS} level The severity tier this log belongs to
 */

/** @type {Record<string, LogType>} */
const types = {
  // Debug / Trace Tier
  debug: { badge: figures.circle, color: 'magenta', label: 'debug', level: 'debug' },
  wait: { badge: figures.ellipsis, color: 'blue', label: 'waiting', level: 'debug' },
  pending: { badge: figures.checkboxOff, color: 'magenta', label: 'pending', level: 'debug' },
  await: { badge: figures.ellipsis, color: 'blue', label: 'awaiting', level: 'debug' },
  watch: { badge: figures.ellipsis, color: 'yellow', label: 'watching', level: 'debug' },

  // Info Tier
  info: { badge: figures.info, color: 'blue', label: 'info', level: 'info' },
  log: { badge: figures.lozenge, color: 'white', label: 'log', level: 'info' },
  success: { badge: figures.tick, color: 'green', label: 'success', level: 'info' },
  start: { badge: figures.play, color: 'green', label: 'start', level: 'info' },
  star: { badge: figures.star, color: 'yellow', label: 'star', level: 'info' },
  fav: { badge: figures.heart, color: 'magenta', label: 'favorite', level: 'info' },
  complete: { badge: figures.checkboxOn, color: 'cyan', label: 'complete', level: 'info' },
  note: { badge: figures.bullet, color: 'blue', label: 'note', level: 'info' },
  pause: { badge: figures.squareSmallFilled, color: 'yellow', label: 'pause', level: 'info' },

  // Warn, Error & Fatal Tiers
  warn: { badge: figures.warning, color: 'yellow', label: 'warning', level: 'warn' },
  error: { badge: figures.cross, color: 'red', label: 'error', level: 'error' },
  fatal: { badge: figures.cross, color: 'red', label: 'fatal', level: 'fatal' },
};

const BADGE_WIDTH = Math.max(...Object.values(types).map((t) => t.badge.length));
const LABEL_WIDTH = Math.max(...Object.values(types).map((t) => t.label.length));
const SCOPE_WIDTH = 13;
const FILE_WIDTH = 20;

const STDERR_TYPES = new Set([types.warn, types.error, types.fatal]);

export class Logger {
  /** @type {Map<string, Logger>} Registry for SLF4J-style LoggerFactory caching */
  static #registry = new Map();

  /**
   * SLF4J-style factory method: `Logger.getLogger('BOOTSTRAP')`
   * @param {string} [scope]
   * @param {Omit<LoggerOptions, 'scope'>} [options]
   * @returns {Logger}
   */
  static getLogger(scope = 'MAIN', options) {
    const key = scope.toUpperCase();
    if (!Logger.#registry.has(key)) {
      Logger.#registry.set(key, new Logger({ ...options, scope: key }));
    }
    return Logger.#registry.get(key);
  }

  /**
   * @param {LoggerOptions} [options]
   */
  constructor(options) {
    const { scope = 'MAIN', scopeColor, fileColor, config: instanceConfig } = options ?? {};

    this.scope = scope.toUpperCase();

    // Layered configuration inheritance
    const mergedConfig = {
      ...DEFAULT_LOGGER_CONFIG,
      ...(sysConfig.logger ?? {}),
      ...(instanceConfig ?? {}),
    };

    // Resolve scope color priority: instance opt -> sysConfig.logger.scopeColors -> defaultScopeColor
    this.scopeColor =
      scopeColor ??
      sysConfig.logger?.scopeColors?.[this.scope] ??
      mergedConfig.defaultScopeColor ??
      'magenta';

    // File color falls back to the resolved scope color
    this.fileColor = fileColor ?? this.scopeColor;

    // Per-scope severity override
    const scopeOverride = sysConfig.logger?.scopeLevels?.[this.scope];
    if (scopeOverride && LEVEL_RANKS[scopeOverride] != null) {
      mergedConfig.level = scopeOverride;
    }

    if (!LEVEL_RANKS[mergedConfig.level]) {
      mergedConfig.level = DEFAULT_LOGGER_CONFIG.level;
    }

    /**
     * @readonly
     * @type {LoggerConfig}
     */
    this.config = Object.freeze(mergedConfig);

    if (this.config.toFile) {
      try {
        mkdirSync(this.config.logDirPath, { recursive: true });
      } catch (err) {
        console.error(
          `[LOGGER:INIT] Failed to create log directory: ${this.config.logDirPath}`,
          err,
        );
      }
    }
  }

  /**
   * Check whether a given LogType should be processed under this instance's config.
   * @private
   * @param {LogType} type
   * @returns {boolean}
   */
  isLevelEnabled(type) {
    const threshold = LEVEL_RANKS[this.config.level] ?? LEVEL_RANKS.info;
    const incoming = LEVEL_RANKS[type.level] ?? LEVEL_RANKS.info;
    return incoming >= threshold;
  }

  get date() {
    return grey(DateTime.now().toFormat(this.config.dateFormat));
  }

  get time() {
    return grey(DateTime.now().toFormat(this.config.timeFormat));
  }

  get scopeName() {
    const padded = this.scope.padEnd(SCOPE_WIDTH);
    return grey(`[${colorize(padded, this.scopeColor)}]`);
  }

  // oxlint-disable-next-line getter-return
  get filename() {
    const original = Error.prepareStackTrace;
    let callers;
    try {
      Error.prepareStackTrace = (_, stack) => stack;
      callers = new Error().stack.map((frame) => frame.getFileName());
    } finally {
      Error.prepareStackTrace = original;
    }

    const path = callers.find((f) => f && f !== callers[0]);
    let file = 'anonymous';
    if (path) {
      file = basename(path.startsWith('file:') ? fileURLToPath(path) : path);
    }
    if (file.length > FILE_WIDTH) file = `${file.slice(0, FILE_WIDTH - 3)}...`;

    return grey(`[${colorize(file.padEnd(FILE_WIDTH), this.fileColor)}]`);
  }

  meta() {
    const meta = [];

    if (this.config.displayDate) meta.push(this.date);
    if (this.config.displayTime) meta.push(this.time);
    if (this.config.displayScope) meta.push(this.scopeName);
    if (this.config.displayFile) meta.push(this.filename);
    if (meta.length > 0) meta.push(grey(figures.pointer));

    return meta;
  }

  buildLog(type, args) {
    const parts = this.meta();

    if (this.config.displayBadge) {
      parts.push(chalk[type.color](type.badge.padEnd(BADGE_WIDTH + 1)));
    }

    if (this.config.displayLabel) {
      const label = this.config.uppercaseLabel ? type.label.toUpperCase() : type.label;
      parts.push(chalk[type.color](label.padEnd(LABEL_WIDTH + 1)));
    }

    const [first] = args;
    if (args.length === 1 && first instanceof Error && first.stack) {
      const [head, ...rest] = first.stack.split('\n');
      parts.push(head);
      if (rest.length > 0) parts.push(grey(`\n${rest.join('\n')}`));
    } else {
      parts.push(format(...args));
    }

    return parts.join(' ');
  }

  write(type, args) {
    if (!this.isLevelEnabled(type)) return;

    const line = this.buildLog(type, args);

    if (STDERR_TYPES.has(type)) {
      console.error(line);
    } else {
      console.log(line);
    }

    if (this.config.toFile) {
      const cleanLine = stripVTControlCharacters(line);
      const fileDate = DateTime.now().toFormat('yyyy-MM-dd');
      const logFile = join(this.config.logDirPath, `${fileDate}.log`);
      appendFileSync(logFile, `${cleanLine}\n`, 'utf8');
    }
  }

  // Debug Methods
  debug(...content) {
    this.write(types.debug, content);
  }
  wait(...content) {
    this.write(types.wait, content);
  }
  pending(...content) {
    this.write(types.pending, content);
  }
  await(...content) {
    this.write(types.await, content);
  }
  watch(...content) {
    this.write(types.watch, content);
  }

  // Info Methods
  info(...content) {
    this.write(types.info, content);
  }
  log(...content) {
    this.write(types.log, content);
  }
  success(...content) {
    this.write(types.success, content);
  }
  start(...content) {
    this.write(types.start, content);
  }
  star(...content) {
    this.write(types.star, content);
  }
  fav(...content) {
    this.write(types.fav, content);
  }
  complete(...content) {
    this.write(types.complete, content);
  }
  note(...content) {
    this.write(types.note, content);
  }
  pause(...content) {
    this.write(types.pause, content);
  }

  // Error & Fatal Methods
  warn(...content) {
    this.write(types.warn, content);
  }
  error(...content) {
    this.write(types.error, content);
  }
  fatal(...content) {
    this.write(types.fatal, content);
  }
}

export default Logger;
