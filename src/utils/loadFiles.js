import { glob } from 'glob';
import path from 'node:path';

/**
 * @typedef {".js" | ".cjs" | ".mjs" | ".jsx"} JSExtensions
 * @typedef {".ts" | ".cts" | ".mts" | ".tsx"} TSExtensions
 * @typedef {".json" | ".yaml" | ".yml" | ".xml"} ConfigExtensions
 * @typedef {".jpeg" | ".jpg" | ".png" | ".gif" | ".svg" | ".webp" | ".ico"} ImageExtensions
 * @typedef {".mp3" | ".wav" | ".flac" | ".aac" | ".ogg"} AudioExtensions
 * @typedef {".mp4" | ".mkv" | ".avi" | ".mov" | ".mpeg"} VideoExtensions
 * @typedef {".csv" | ".txt" | ".log"} LogExtensions
 * @typedef {JSExtensions | TSExtensions} ScriptExtensions
 * @typedef {AudioExtensions | VideoExtensions} MediaExtensions
 * @typedef {ImageExtensions | ConfigExtensions} AssetExtensions
 * @typedef {ScriptExtensions | MediaExtensions | AssetExtensions | LogExtensions} FileTypes
 */

/**
 * Returns an array of absolute file paths matching the provided extensions.
 * @param {string} dirPath - Relative or absolute directory path to crawl
 * @param {FileTypes[] | string[]} extensions - Array of extensions with or without leading dots (e.g. ['.js', 'ts'])
 * @returns {Promise<string[]>} List of absolute file paths
 *
 * @example
 * const commandFiles = await loadFiles('src/commands', ['.js']);
 * @example
 * const mediaFiles = await loadFiles('assets', ['.mp4', '.png']);
 */
export async function loadFiles(dirPath, extensions = []) {
  // Normalize extensions: strip leading dot to build glob pattern (e.g., '.js' -> 'js')
  const cleanExts = extensions.map((ext) => ext.replace(/^\./, ''));

  // If extensions are provided, construct brace expansion: **/*.{js,ts} or **/*.js
  const pattern =
    cleanExts.length > 1 ? `**/*.{${cleanExts.join(',')}}`
    : cleanExts.length === 1 ? `**/*.${cleanExts[0]}`
    : '**/*.*';

  const absoluteDirPath = path.resolve(process.cwd(), dirPath);

  // Search recursively using the target directory as root cwd
  const matches = await glob(pattern, {
    cwd: absoluteDirPath,
    absolute: true,
    nodir: true,
    windowsPathsNoEscape: true,
  });

  return matches;
}

export default loadFiles;
