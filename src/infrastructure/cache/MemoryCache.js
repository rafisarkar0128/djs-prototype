import { LRUCache } from 'lru-cache';

/**
 * Generic in-memory LRU cache adapter.
 * @template TKey
 * @template TValue
 */
export class MemoryCache {
  /** @type {LRUCache<TKey, TValue>} */
  #store;

  /**
   * @param {{ max?: number, ttl?: number }} [options]
   */
  constructor(options = {}) {
    this.#store = new LRUCache({
      max: options.max ?? 10_000,
      ttl: options.ttl,
    });
  }

  get(key) {
    return this.#store.get(key) ?? null;
  }

  set(key, value, options) {
    this.#store.set(key, value, options);
  }

  has(key) {
    return this.#store.has(key);
  }

  delete(key) {
    return this.#store.delete(key);
  }

  clear() {
    this.#store.clear();
  }

  get size() {
    return this.#store.size;
  }
}

export default MemoryCache;
