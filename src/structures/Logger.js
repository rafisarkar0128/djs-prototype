// oxlint-disable getter-return
import chalk from 'chalk';
import figures from 'figures';
import { DateTime } from 'luxon';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'node:util';

const { grey, magenta } = chalk;

const defaultOptions = Object.freeze({
  scope: 'MAIN',
  /** @type {keyof chalk} */
  fileColor: 'cyanBright',
  config: Object.freeze({
    dateFormat: '[dd/MM/yyyy]',
    timeFormat: '[h:mm:ss a]',
    toFile: false,
    logDirPath: './logs/',
    level: 'info',
    displayDate: true,
    displayTime: true,
    displayScope: false,
    displayFile: true,
    displayBadge: false,
    displayLabel: true,
    uppercaseLabel: true,
  }),
});

/**
 * @typedef {{ -readonly [K in keyof typeof defaultOptions.config]: (typeof defaultOptions.config)[K] }} LoggerConfig
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [scope] The scope shown in the log meta
 * @property {keyof chalk} [fileColor] The chalk color of the origin filename
 * @property {Partial<LoggerConfig>} [config] Display toggles, merged over the defaults
 */

/**
 * Typings for the log types of the logger
 * @typedef {Object} LogType
 * @property {string} badge The symbol of the log
 * @property {keyof chalk} color The color for the label
 * @property {string} label The label of the log
 */

/** @type {Record<string, LogType>} */
const types = {
  info: { badge: figures.info, color: 'blue', label: 'info' },
  warn: { badge: figures.warning, color: 'yellow', label: 'warning' },
  error: { badge: figures.cross, color: 'red', label: 'error' },
  debug: { badge: figures.circle, color: 'magenta', label: 'debug' },
  success: { badge: figures.tick, color: 'green', label: 'success' },
  log: { badge: figures.lozenge, color: 'white', label: 'log' },
  pause: { badge: figures.squareSmallFilled, color: 'yellow', label: 'pause' },
  start: { badge: figures.play, color: 'green', label: 'start' },
  star: { badge: figures.star, color: 'yellow', label: 'star' },
  fatal: { badge: figures.cross, color: 'red', label: 'fatal' },
  fav: { badge: figures.heart, color: 'magenta', label: 'favorite' },
  wait: { badge: figures.ellipsis, color: 'blue', label: 'waiting' },
  complete: { badge: figures.checkboxOn, color: 'cyan', label: 'complete' },
  pending: { badge: figures.checkboxOff, color: 'magenta', label: 'pending' },
  note: { badge: figures.bullet, color: 'blue', label: 'note' },
  await: { badge: figures.ellipsis, color: 'blue', label: 'awaiting' },
  watch: { badge: figures.ellipsis, color: 'yellow', label: 'watching' },
};

const BADGE_WIDTH = Math.max(...Object.values(types).map((t) => t.badge.length));
const LABEL_WIDTH = Math.max(...Object.values(types).map((t) => t.label.length));
const SCOPE_WIDTH = 8;
const FILE_WIDTH = 20;

/** Log types written to stderr instead of stdout */
const STDERR_TYPES = new Set([types.warn, types.error, types.fatal]);

/**
 * A utility class for managing client console logs.
 */
export class Logger {
  /**
   * @param {LoggerOptions} [options] The options to initialize the logger with
   */
  constructor(options) {
    const { scope, fileColor, config } = options ?? {};

    /**
     * The scope for the logger
     * @private
     * @type {string}
     */
    this._scope = scope ?? defaultOptions.scope;

    /**
     * The color of the filename for the logger
     * @private
     * @type {keyof chalk}
     */
    this._fileColor = fileColor ?? defaultOptions.fileColor;

    /**
     * The display config for the logger (a private copy, defaults are never mutated)
     * @private
     * @type {LoggerConfig}
     */
    this._config = { ...defaultOptions.config };
    for (const [key, value] of Object.entries(config ?? {})) {
      if (value != null) this._config[key] = value;
    }
  }

  /**
   * Get the date of the log message.
   * @private
   * @returns {string}
   */
  get _date() {
    return grey(DateTime.now().toFormat(this._config.dateFormat));
  }

  /**
   * Get the time of the log message.
   * @private
   * @returns {string}
   */
  get _time() {
    return grey(DateTime.now().toFormat(this._config.timeFormat));
  }

  /**
   * Get the scope name for this logger.
   * @private
   * @returns {string}
   */
  get _scopeName() {
    return grey(`[${magenta(this._scope.padEnd(SCOPE_WIDTH))}]`);
  }

  /**
   * Get the origin (file name) of the log.
   * @private
   * @returns {string}
   */
  get _filename() {
    const original = Error.prepareStackTrace;
    let callers;
    try {
      Error.prepareStackTrace = (_, stack) => stack;
      // `.stack` is formatted lazily, so it must be read while the override is active
      callers = new Error().stack.map((frame) => frame.getFileName());
    } finally {
      Error.prepareStackTrace = original;
    }

    // first frame outside this file is the real caller
    const path = callers.find((f) => f && f !== callers[0]);
    let file = 'anonymous';
    if (path) {
      file = basename(path.startsWith('file:') ? fileURLToPath(path) : path);
    }
    if (file.length > FILE_WIDTH) file = `${file.slice(0, FILE_WIDTH - 3)}...`;

    return grey(`[${chalk[this._fileColor](file.padEnd(FILE_WIDTH))}]`);
  }

  /**
   * Build the meta (date, time, scope, file) parts of a log.
   * @private
   * @returns {string[]}
   */
  _meta() {
    const meta = [];

    if (this._config.displayDate) meta.push(this._date);
    if (this._config.displayTime) meta.push(this._time);
    if (this._config.displayScope) meta.push(this._scopeName);
    if (this._config.displayFile) meta.push(this._filename);
    if (meta.length > 0) meta.push(grey(figures.pointer));

    return meta;
  }

  /**
   * Build the full log line.
   * @private
   * @param {LogType} type
   * @param {any[]} args
   * @returns {string}
   */
  _buildLog(type, args) {
    const parts = this._meta();

    if (this._config.displayBadge) {
      parts.push(chalk[type.color](type.badge.padEnd(BADGE_WIDTH + 1)));
    }

    if (this._config.displayLabel) {
      const label = this._config.uppercaseLabel ? type.label.toUpperCase() : type.label;
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

  /**
   * Build and print a log line.
   * @private
   * @param {LogType} type
   * @param {any[]} args
   * @returns {void}
   */
  _write(type, args) {
    const line = this._buildLog(type, args);
    if (STDERR_TYPES.has(type)) console.error(line);
    else console.log(line);
  }

  info(...content) {
    this._write(types.info, content);
  }

  warn(...content) {
    this._write(types.warn, content);
  }

  error(...content) {
    this._write(types.error, content);
  }

  debug(...content) {
    this._write(types.debug, content);
  }

  success(...content) {
    this._write(types.success, content);
  }

  log(...content) {
    this._write(types.log, content);
  }

  pause(...content) {
    this._write(types.pause, content);
  }

  start(...content) {
    this._write(types.start, content);
  }

  star(...content) {
    this._write(types.star, content);
  }

  fatal(...content) {
    this._write(types.fatal, content);
  }

  fav(...content) {
    this._write(types.fav, content);
  }

  wait(...content) {
    this._write(types.wait, content);
  }

  complete(...content) {
    this._write(types.complete, content);
  }

  pending(...content) {
    this._write(types.pending, content);
  }

  note(...content) {
    this._write(types.note, content);
  }

  await(...content) {
    this._write(types.await, content);
  }

  watch(...content) {
    this._write(types.watch, content);
  }
}
