import chalk from 'chalk';
import process from 'node:process';
import { stripVTControlCharacters } from 'node:util';
import { table, getBorderCharacters } from 'table';
import pkg from '#root/package.json' with { type: 'json' };

function getRuntimeInfo() {
  const g = globalThis;

  if (g.Bun?.version || g.process?.versions?.bun) {
    const ver = g.Bun?.version || g.process?.versions?.bun;
    return {
      name: 'Bun',
      version: ver.startsWith('v') ? ver : `v${ver}`,
      color: '#F472B6',
    };
  }

  if (g.Deno?.version?.deno) {
    return {
      name: 'Deno',
      version: `v${g.Deno.version.deno}`,
      color: '#00D2D3',
    };
  }

  if (g.process?.version) {
    return {
      name: 'Node.js',
      version: g.process.version,
      color: '#57F287',
    };
  }

  return { name: 'Unknown', version: 'N/A', color: '#FFFFFF' };
}

/**
 * Centers a block of text within the terminal width.
 * @param {string} text - The text to center.
 * @param {number} termWidth - The width of the terminal.
 * @returns {string} - The centered text.
 */
function centerBlock(text, termWidth) {
  return text
    .split('\n')
    .map((line) => {
      const visualWidth = stripVTControlCharacters(line).length;
      const pad = Math.max(0, Math.floor((termWidth - visualWidth) / 2));
      return ' '.repeat(pad) + line;
    })
    .join('\n');
}

/**
 * Prints the enterprise startup banner and environment info to the console.
 */
export function printBanner() {
  const termWidth = process.stdout.isTTY ? process.stdout.columns || 110 : 110;

  const djs = chalk.hex('#5865F2').bold;
  const proto = chalk.hex('#00D2D3').bold;

  const bannerLines = [
    djs('██████╗      ██╗███████╗') +
      proto('██████╗ ██████╗  ██████╗ ████████╗ ██████╗ ████████╗██╗   ██╗██████╗ ███████╗'),
    djs('██╔══██╗     ██║██╔════╝') +
      proto('██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔═══██╗╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝'),
    djs('██║  ██║     ██║███████╗') +
      proto('██████╔╝██████╔╝██║   ██║   ██║   ██║   ██║   ██║    ╚████╔╝ ██████╔╝█████╗  '),
    djs('██║  ██║██   ██║╚════██║') +
      proto('██╔═══╝ ██╔══██╗██║   ██║   ██║   ██║   ██║   ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  '),
    djs('██████╔╝╚█████╔╝███████║') +
      proto('██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝   ██║      ██║   ██║     ███████╗'),
    djs('╚═════╝  ╚════╝ ╚══════╝') +
      proto('╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝    ╚═╝      ╚═╝   ╚═╝     ╚══════╝'),
  ].join('\n');

  const baseBorder = {
    ...getBorderCharacters('norc'),
    topJoin: '─',
    bottomJoin: '─',
    bodyJoin: ' ',
    joinBody: ' ',
    joinJoin: ' ',
    joinLeft: '│',
    joinRight: '│',
  };

  const coloredBorder = Object.fromEntries(
    Object.entries(baseBorder).map(([k, v]) => [k, chalk.hex('#5865F2')(v)]),
  );

  /** @type {import("table").TableUserConfig} */
  const config = {
    columns: [
      { alignment: 'right', width: 34 },
      { alignment: 'left', width: 46 },
    ],
    border: coloredBorder,
    drawHorizontalLine: (lineIndex, rowCount) => lineIndex === 0 || lineIndex === rowCount,
  };

  const runtime = getRuntimeInfo();

  const data = [
    [chalk.hex('#8F9CAE')('Application  ›'), `${djs('djs')}${chalk.dim('-')}${proto('prototype')}`],
    [
      chalk.dim('Environment  ›'),
      `${chalk.white(runtime.name)} ${chalk.hex(runtime.color)(runtime.version)}`,
    ],
    [chalk.dim('Version  ›'), chalk.hex('#FEE75C')(pkg.version ?? '5.0.0-snapshot')],
    [chalk.dim('Author  ›'), chalk.hex('#EB459E')(pkg.author ?? 'rafisarkar0128')],
  ];

  const renderedTable = table(data, config).trimEnd();

  console.log(`\n${centerBlock(bannerLines, termWidth)}\n`);
  console.log(`${centerBlock(renderedTable, termWidth)}\n`);
}
