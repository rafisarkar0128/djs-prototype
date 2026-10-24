/**
 * In-memory cooldown storage.
 * Easily swappable with a RedisCooldownRepository later without touching business logic.
 */
export class MemoryCooldownRepository {
  /**
   * Primary key: commandName -> (secondary key: userId -> expirationTimestamp)
   * @type {Map<string, Map<string, number>>}
   */
  #store = new Map();

  /**
   * Get the expiration timestamp for a given subject.
   * @param {string} key Command or action identifier
   * @param {string} subjectId User ID or Guild ID
   * @returns {number | null} Expiry timestamp in milliseconds, or null if expired/unset
   */
  get(key, subjectId) {
    const bucket = this.#store.get(key);
    if (!bucket) return null;

    const expiresAt = bucket.get(subjectId);
    if (!expiresAt) return null;

    // Passive eviction: if it's already expired, clean it up immediately
    if (Date.now() >= expiresAt) {
      bucket.delete(subjectId);
      return null;
    }

    return expiresAt;
  }

  /**
   * Set a cooldown expiration timestamp.
   * @param {string} key
   * @param {string} subjectId
   * @param {number} ttlSeconds Duration in seconds
   */
  set(key, subjectId, ttlSeconds) {
    if (!this.#store.has(key)) {
      this.#store.set(key, new Map());
    }

    const bucket = this.#store.get(key);
    const expiresAt = Date.now() + ttlSeconds * 1000;
    bucket.set(subjectId, expiresAt);
  }

  /**
   * Manually invalidate or reset a cooldown.
   * @param {string} key
   * @param {string} subjectId
   */
  delete(key, subjectId) {
    const bucket = this.#store.get(key);
    if (bucket) {
      bucket.delete(subjectId);
    }
  }
}

export default MemoryCooldownRepository;
