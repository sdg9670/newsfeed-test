import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { SchoolModule } from './school/school.module';
import { MyNewsfeedModule } from './myNewsfeed/myNewsfeed.module';
import { MySubscribtionModule } from './mySubscribtion/mySubscribtion.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    MyNewsfeedModule,
    MySubscribtionModule,
    NewsModule,
    SchoolModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
