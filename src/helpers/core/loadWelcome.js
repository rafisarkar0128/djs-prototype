import chalk from 'chalk';
import { table, getBorderCharacters } from 'table';
import pkg from '#root/package.json' with { type: 'json' };

// oxlint-disable-next-line no-control-regex
const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

function stripAnsi(str) {
  return str.replace(ANSI_REGEX, '');
}

function getRuntimeInfo() {
  const g = globalThis;

  if (g.Bun?.version || g.process?.versions?.bun) {
    const ver = g.Bun?.version || g.process?.versions?.bun;
    return {
      name: 'Bun',
      version: ver.startsWith('v') ? ver : `v${ver}`,
      color: '#F472B6', // Bun soft pink/peach
    };
  }

  if (g.Deno?.version?.deno) {
    return {
      name: 'Deno',
      version: `v${g.Deno.version.deno}`,
      color: '#00D2D3', // Deno cyan
    };
  }

  if (g.process?.version) {
    return {
      name: 'Node.js',
      version: g.process.version,
      color: '#57F287', // Node green
    };
  }

  return { name: 'Unknown', version: 'N/A', color: '#FFFFFF' };
}

function centerBlock(text, termWidth) {
  return text
    .split('\n')
    .map((line) => {
      const visualWidth = stripAnsi(line).length;
      const pad = Math.max(0, Math.floor((termWidth - visualWidth) / 2));
      return ' '.repeat(pad) + line;
    })
    .join('\n');
}

export function loadWelcome() {
  const termWidth = process.stdout.columns || 110;

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

  const cleanBorder = {
    ...getBorderCharacters('norc'),
    topJoin: '─',
    bottomJoin: '─',
    bodyJoin: ' ',
    joinBody: ' ',
    joinJoin: ' ',
    joinLeft: '│',
    joinRight: '│',
  };

  const coloredBorder = {};
  for (const [key, val] of Object.entries(cleanBorder)) {
    coloredBorder[key] = chalk.hex('#5865F2')(val);
  }

  // Expanded widths to match banner scale and lock horizontal centering
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

  console.log('\n' + centerBlock(bannerLines, termWidth) + '\n');
  console.log(centerBlock(renderedTable, termWidth) + '\n');
}
