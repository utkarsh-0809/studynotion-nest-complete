// import { Module } from '@nestjs/common';
// import { CacheService } from './cache.service';
// import { CacheController } from './cache.controller';

// @Module({
//   controllers: [CacheController],
//   providers: [CacheService],
// })
// export class CacheModule {}

import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService], // export so other modules can use it
})
export class CacheModule {}
