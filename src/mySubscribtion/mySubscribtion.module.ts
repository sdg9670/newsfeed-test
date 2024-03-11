import { Module } from '@nestjs/common';
import { MySubscribtionController } from './mySubscribtion.controller';
import { MySubscribtionService } from './mySubscribtion.service';

@Module({
  controllers: [MySubscribtionController],
  providers: [MySubscribtionService],
})
export class MySubscribtionModule {}
