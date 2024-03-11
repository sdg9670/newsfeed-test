import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { GetMyNewsfeedResponseBody } from 'src/common/models/newsfeed.model';

@Injectable()
export class MyNewsfeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getMyNewsfeed({
    userId,
    page,
    limit,
  }: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<GetMyNewsfeedResponseBody> {
    const subscribedNewsList =
      await this.databaseService.subscribedNews.findMany({
        where: {
          userId,
          deletedAt: { isSet: false },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

    const totalPage = Math.ceil(
      (await this.databaseService.subscribedNews.count({
        where: {
          userId,
          deletedAt: { isSet: false },
        },
      })) / limit,
    );

    const newsList = await this.databaseService.news.findMany({
      where: {
        id: {
          in: subscribedNewsList.map((news) => news.newsId),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      newsList,
      totalPage,
    };
  }
}
