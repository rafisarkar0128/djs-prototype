import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import chalk from 'chalk';
import readline from 'node:readline/promises';
import process from 'node:process';

const token = process.env.DISCORD_CLIENT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const serverId = process.env.GUILD_ID;

if (!token || !clientId || !serverId) {
  console.log(
    chalk.red(
      '❌ Missing DISCORD_CLIENT_TOKEN, DISCORD_CLIENT_ID, or GUILD_ID in environment variables.',
    ),
  );
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const warningMsg = [
  '----------------------------------- !!! WARNING !!! -----------------------------------',
  'This script will delete every guild slash & context menu command of your discord bot.',
  'Do you want to continue? (y/n): ',
].join('\n');

console.clear();

try {
  const answer = await rl.question(warningMsg);
  rl.close();

  if (answer.trim().toLowerCase() === 'y') {
    await deleteCommands();
    process.exit(0);
  } else {
    console.log(chalk.red('Canceled the deletion.'));
    process.exit(0);
  }
} catch (error) {
  rl.close();
  console.error(chalk.red(error?.stack ?? error));
  process.exit(1);
}

async function deleteCommands() {
  const guild = await rest.get(Routes.guild(serverId));
  const commands = await rest.get(Routes.applicationGuildCommands(clientId, serverId));

  if (!commands || commands.length === 0) {
    console.log(`\n❗ Couldn't find any guild command in ${chalk.yellow(guild.name)}.`);
    return;
  }

  console.log(
    `\n✅ Found ${chalk.cyan(commands.length)} guild commands in ${chalk.yellow(guild.name)}.\n`,
  );

  commands.forEach((command, index) => {
    const paddedIndex = String(index + 1).padStart(3, ' ');
    console.log(
      `${chalk.magenta(paddedIndex)} | 🔥 ${chalk.red('deleted')} - ${command.id} - ${chalk.cyan(command.name)}`,
    );
  });

  await rest.put(Routes.applicationGuildCommands(clientId, serverId), {
    body: [],
  });

  console.log(`\n✅ Deleted all commands in ${chalk.yellow(guild.name)}.`);
}
