import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { glob } from 'glob';
import pkg from '#root/package.json' with { type: 'json' };

/**
 * Resolves a virtual subpath import (#...) or regular relative/absolute path
 * to an actual absolute filesystem path.
 *
 * @param {string} inputPath Path or subpath import specifier (e.g. '#infra/discord/events')
 * @returns {string} Absolute directory path on disk
 */
function resolveDirPath(inputPath) {
  if (!inputPath.startsWith('#')) {
    return path.resolve(process.cwd(), inputPath);
  }

  const imports = pkg.imports ?? {};

  // Direct exact match (e.g., "#infra": "./src/infrastructure")
  if (imports[inputPath]) {
    const target =
      typeof imports[inputPath] === 'string' ? imports[inputPath] : imports[inputPath].default;
    return path.resolve(process.cwd(), target);
  }

  // Pattern match (e.g., input is "#infra/discord/events" or "#infra" matching "#infra/*": "./src/infrastructure/*")
  for (const [pattern, target] of Object.entries(imports)) {
    if (!pattern.endsWith('/*')) continue;

    const basePattern = pattern.slice(0, -2); // e.g., "#infra"
    const resolvedTarget = typeof target === 'string' ? target : target?.default;
    if (!resolvedTarget) continue;

    const baseTarget = resolvedTarget.slice(0, -2); // e.g., "./src/infrastructure"

    // Exact alias root match: loadFilesAsUrls('#infra')
    if (inputPath === basePattern) {
      return path.resolve(process.cwd(), baseTarget);
    }

    // Subpath match: loadFilesAsUrls('#infra/discord/events')
    if (inputPath.startsWith(`${basePattern}/`)) {
      const subPath = inputPath.slice(basePattern.length + 1);
      return path.resolve(process.cwd(), baseTarget, subPath);
    }
  }

  // Fallback if not found in package.json imports
  return path.resolve(process.cwd(), inputPath);
}

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
 * Supports absolute paths, relative paths, and package.json `#` subpath imports.
 *
 * @param {string} dirPath Relative, absolute, or `#` subpath import path to crawl
 * @param {FileTypes[] | string[]} [extensions] Array of extensions with or without leading dots
 * @returns {Promise<string[]>} List of absolute file paths
 *
 * @example
 * const commandFiles = await loadFiles('#infra/discord/commands', ['.js']);
 */
export async function loadFiles(dirPath, extensions = ['.js']) {
  const absoluteDirPath = resolveDirPath(dirPath);

  if (!existsSync(absoluteDirPath)) {
    return [];
  }

  const cleanExts = extensions.map((ext) => ext.replace(/^\./, ''));

  const pattern =
    cleanExts.length > 1 ? `**/*.{${cleanExts.join(',')}}`
    : cleanExts.length === 1 ? `**/*.${cleanExts[0]}`
    : '**/*.*';

  const matches = await glob(pattern, {
    cwd: absoluteDirPath,
    absolute: true,
    nodir: true,
    windowsPathsNoEscape: true,
  });

  return matches;
}

/**
 * Convenience helper that resolves files and converts paths to file:// URLs,
 * making them directly consumable by native ESM dynamic `import()`.
 *
 * @param {string} dirPath Relative, absolute, or `#` subpath import path to crawl
 * @param {FileTypes[] | string[]} [extensions] Array of extensions with or without leading dots
 * @returns {Promise<string[]>} Array of valid file:// URLs
 *
 * @example
 * const files = await loadFilesAsUrls('#infra/discord/events');
 * for (const fileUrl of files) {
 *   const module = await import(fileUrl);
 * }
 */
export async function loadFilesAsUrls(dirPath, extensions = ['.js']) {
  const paths = await loadFiles(dirPath, extensions);
  return paths.map((p) => pathToFileURL(p).href);
}

export default loadFiles;
