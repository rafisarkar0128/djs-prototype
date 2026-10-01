import 'dotenv/config'; // Load environment variables from .env file
import 'module-alias/register'; // Register module aliases

import { ShardingManager } from 'discord.js';
import Logger from '#structures/Logger.js';
const logger = new Logger();
import chalk from 'chalk';

const manager = new ShardingManager('./src/index.js', {
  respawn: true,
  token: process.env.DISCORD_CLIENT_TOKEN,
  totalShards: 'auto',
  shardList: 'auto',
});

manager.on('shardCreate', (shard) => {
  shard.on('ready', () => {
    logger.info(`Shard ${chalk.cyan(shard.id)} connected to Discord's Gateway.`);
  });

  shard.on('disconnect', () => {
    logger.warn(`Shard ${chalk.cyan(shard.id)} disconnected from Discord's Gateway.`);
  });

  shard.on('error', (error) => {
    logger.error(`Shard ${chalk.cyan(shard.id)} encountered an error: ${error.message}`);
  });
});

async function startShard() {
  try {
    await manager.spawn();
    logger.info(`${chalk.blueBright(manager.totalShards)} shard(s) spawned.`);
  } catch (error) {
    logger.error(`Error starting shard manager: ${error.message}`);
    process.exit(1);
  }
}

startShard();
