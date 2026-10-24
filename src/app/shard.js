// oxlint-disable-next-line
import 'dotenv/config';

import { ShardingManager } from 'discord.js';
import { Logger } from '#root/src/old/structures/Logger.js';
import chalk from 'chalk';

const logger = new Logger({
  scope: 'SHARD',
  config: {
    level: process.env.LOG_LEVEL ?? 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    logDirPath: process.env.LOG_DIR_PATH ?? './logs/',
    dateFormat: process.env.LOG_DATE_FORMAT ?? '[dd/MM/yyyy]',
    timeFormat: process.env.LOG_TIME_FORMAT ?? '[h:mm:ss a]',
    displayScope: process.env.LOG_DISPLAY_SCOPE === 'true',
    displayFileName: process.env.LOG_DISPLAY_FILENAME === 'true',
    displayBadge: process.env.LOG_DISPLAY_BADGE !== 'false',
    displayLabel: process.env.LOG_DISPLAY_LABEL !== 'false',
    uppercaseLabel: process.env.LOG_UPPERCASE_LABEL !== 'false',
  },
});
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
