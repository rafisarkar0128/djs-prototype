import { MemoryCache } from '#infra/cache/MemoryCache.js';

/**
 * @template TEntity
 */
export class BaseRepository {
  /** @type {import('mongodb').Collection} */
  collection;

  /** @type {MemoryCache<string, TEntity>} */
  cache;

  /**
   * @param {import('mongodb').Collection} collection
   * @param {{ max?: number, ttl?: number }} [cacheOptions]
   */
  constructor(collection, cacheOptions = {}) {
    this.collection = collection;
    // Cache layer abstraction injected here
    this.cache = new MemoryCache({
      max: cacheOptions.max,
      ttl: cacheOptions.ttl,
    });
  }

  /**
   * @abstract
   * @param {Record<string, any>} raw
   * @returns {TEntity}
   */
  toDomain(_raw) {
    throw new Error('toDomain() must be implemented by subclass.');
  }

  async findById(id) {
    // 1. Fast hit from #infra/cache
    const cached = this.cache.get(id);
    if (cached) return cached;

    // 2. Miss falls back to MongoDB
    const raw = await this.collection.findOne({ _id: id });
    if (!raw) return null;

    const entity = this.toDomain(raw);
    this.cache.set(id, entity);
    return entity;
  }

  async save(entity) {
    const payload = entity.toPersistence();
    await this.collection.updateOne({ _id: entity.id }, { $set: payload }, { upsert: true });
    this.cache.set(entity.id, entity);
  }

  evict(id) {
    this.cache.delete(id);
  }
}
