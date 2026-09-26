/**
 * @module CacheEngine
 * @description High-performance client and server-side LRU & Hashing Cache Engine for Veridex.
 * Accelerates document extraction, statutory search, and grounded Q&A with sub-millisecond response times.
 * @designPattern Singleton Cache Pattern & Memoization Strategy
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class CacheEngine {
  private static instance: CacheEngine;
  private memoryCache: Map<string, CacheEntry<unknown>>;
  private readonly defaultTtlMs: number;

  private constructor() {
    this.memoryCache = new Map<string, CacheEntry<unknown>>();
    // Default cache TTL: 30 minutes
    this.defaultTtlMs = 30 * 60 * 1000;
  }

  /**
   * Retrieves singleton instance of CacheEngine.
   */
  public static getInstance(): CacheEngine {
    if (!CacheEngine.instance) {
      CacheEngine.instance = new CacheEngine();
    }
    return CacheEngine.instance;
  }

  /**
   * Generates a deterministic FNV-1a hash key from arbitrary input string.
   * @param input Raw text or query string
   * @returns Hexadecimal string hash
   */
  public hashKey(input: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  /**
   * Retrieves cached item if valid and not expired.
   * @param key Cache lookup key
   * @returns Cached item or null
   */
  public get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
    if (isExpired) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Stores value in cache with optional TTL.
   * @param key Cache key
   * @param value Value to store
   * @param ttlMs Time-to-live in milliseconds
   */
  public set<T>(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    // Limit memory cache size to 100 entries to prevent memory bloat
    if (this.memoryCache.size >= 100) {
      const firstKey = this.memoryCache.keys().next().value;
      if (firstKey) this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttlMs
    });
  }

  /**
   * Clears all cached entries.
   */
  public clear(): void {
    this.memoryCache.clear();
  }
}

export const veridexCache = CacheEngine.getInstance();
