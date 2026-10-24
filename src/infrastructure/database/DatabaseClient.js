import { MongoClient } from 'mongodb';
import chalk from 'chalk';
import { Logger } from '#core/logger/Logger.js';

const log = Logger.getLogger('DATABASE', {
  scopeColor: 'greenBright',
});

export class DatabaseClient {
  /** @type {MongoClient | null} */
  #client = null;

  /** @type {import('mongodb').Db | null} */
  #db = null;

  /** @type {Readonly<typeof import('#app/config/index.js').default>} */
  #config;

  /**
   * @param {Readonly<typeof import('#app/config/index.js').default>} config
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Initializes the native MongoClient and establishes a connection.
   * @returns {Promise<import('mongodb').Db>}
   */
  async connect() {
    const { uri, options } = this.#config.database;

    if (!uri) {
      throw new Error('[DatabaseClient] Missing MONGO_URI in application configuration.');
    }

    try {
      this.#client = new MongoClient(uri, options);
      await this.#client.connect();

      const dbName = options?.dbName ?? 'djs-prototype';
      this.#db = this.#client.db(dbName);

      log.success(`Connected to MongoDB database: ${chalk.greenBright(dbName)}`);
      return this.#db;
    } catch (error) {
      log.fatal(`Failed to connect to MongoDB at "${uri}":`, error);
      throw error;
    }
  }

  /**
   * Gracefully closes the MongoDB connection pool.
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.#client) return;

    try {
      await this.#client.close();
      this.#client = null;
      this.#db = null;
      log.info('Disconnected from MongoDB.');
    } catch (error) {
      log.error('Error encountered while disconnecting MongoDB client:', error);
      throw error;
    }
  }

  /**
   * The active native MongoDB Db instance.
   * @returns {import('mongodb').Db}
   */
  get db() {
    if (!this.#db) {
      throw new Error('[DatabaseClient] Database is not connected. Call connect() first.');
    }
    return this.#db;
  }

  /**
   * The underlying native MongoClient.
   * @returns {MongoClient}
   */
  get client() {
    if (!this.#client) {
      throw new Error('[DatabaseClient] MongoClient is not initialized.');
    }
    return this.#client;
  }
}

export default DatabaseClient;
