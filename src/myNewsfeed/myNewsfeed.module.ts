import { Module } from '@nestjs/common';
import { MyNewsfeedController } from './myNewsfeed.controller';
import { MyNewsfeedService } from './myNewsfeed.service';

@Module({
  controllers: [MyNewsfeedController],
  providers: [MyNewsfeedService],
})
export class MyNewsfeedModule {}
