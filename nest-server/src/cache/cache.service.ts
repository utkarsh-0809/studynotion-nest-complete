// // import { Injectable } from '@nestjs/common';

// // @Injectable()
// // export class CacheService {}
// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { createClient } from 'redis';

// @Injectable()
// export class CacheService implements OnModuleInit {
//   private client;

//   async onModuleInit() {
//     this.client = createClient({
//       url: 'redis://localhost:6379',
//     });

//     this.client.on('error', (err) => console.error('Redis Error:', err));
//     await this.client.connect();
//   }

//   async get(key: string) {
//     const data = await this.client.get(key);
//     return data ? JSON.parse(data) : null;
//   }

//   async set(key: string, value: any, ttl: number) {
//     await this.client.setEx(key, ttl, JSON.stringify(value));
//   }

//   async del(key: string) {
//     await this.client.del(key);
//   }
// }
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 36000; // seconds

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    this.client = createClient({ url: redisUrl });

    this.client.on('error', (err) => this.logger.error('Redis Error', err));
    this.client.on('connect', () => this.logger.log('Redis connecting...'));
    this.client.on('ready', () => this.logger.log('Redis ready'));
    this.client.on('end', () => this.logger.log('Redis connection closed'));

    try {
      await this.client.connect();
      this.logger.log(`Connected to Redis at ${redisUrl}`);
    } catch (err) {
      // Important: don't crash the whole app — allow the app to run even if redis is down.
      this.logger.error('Failed to connect to Redis', err as any);
      this.client = null;
    }
  }

  private ensureClient() {
    if (!this.client) throw new Error('Redis client not available');
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const data = await this.client.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (err) {
      // If it's not JSON, return raw string
      this.logger.debug(`Failed to parse JSON for key=${key}, returning raw string`);
      return (data as unknown) as T;
    }
  }

  /**
   * @param ttl seconds. if ttl === 0 or null -> set without expiry
   */
  async set(key: string, value: any, ttl: number | null = this.DEFAULT_TTL): Promise<void> {
    if (!this.client) return;
    const payload = typeof value === 'string' ? value : JSON.stringify(value);

    if (!ttl || ttl <= 0) {
      await this.client.set(key, payload);
    } else {
      await this.client.setEx(key, ttl, payload);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
        this.logger.log('Redis client disconnected gracefully');
      } catch (err) {
        this.logger.warn('Error quitting Redis client, forcing disconnect');
        try { await this.client.disconnect(); } catch (_) {}
      }
    }
  }
}
