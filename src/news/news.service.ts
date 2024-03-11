import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import {
  GetNewsListResponseBody,
  NewsEntity,
} from '../common/models/news.model';

@Injectable()
export class NewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createNews({
    schoolId,
    title,
    content,
    adminId,
  }: {
    schoolId: string;
    title: string;
    content: string;
    adminId: string;
  }): Promise<NewsEntity> {
    if (!(await this.hasSchoolByAdmin({ adminId, schoolId })))
      throw new HttpException('The admin does not have this school', 500);

    const news = await this.databaseService.news.create({
      data: {
        title,
        content,
        schoolId,
      },
    });

    await this.createSubscribedNews(news);

    return news;
  }

  async updateNews({
    schoolId,
    newsId,
    title,
    content,
    adminId,
  }: {
    schoolId: string;
    newsId: string;
    title: string;
    content: string;
    adminId: string;
  }): Promise<NewsEntity> {
    if (!(await this.hasSchoolByAdmin({ adminId, schoolId })))
      throw new HttpException('The admin does not have this school', 500);

    return await this.databaseService.news.update({
      where: { id: newsId },
      data: { title, content },
    });
  }

  async removeNews({
    schoolId,
    newsId,
    adminId,
  }: {
    schoolId: string;
    newsId: string;
    adminId: string;
  }): Promise<NewsEntity> {
    if (!(await this.hasSchoolByAdmin({ adminId, schoolId })))
      throw new HttpException('The admin does not have this school', 500);

    const news = await this.databaseService.news.update({
      where: { id: newsId },
      data: { deletedAt: new Date() },
    });

    await this.removeSubscribedNews(news);

    return news;
  }

  async getNewsList({
    adminId,
    userId,
    schoolId,
    page,
    limit,
  }: {
    adminId?: string;
    userId?: string;
    schoolId: string;
    page: number;
    limit: number;
  }): Promise<GetNewsListResponseBody> {
    if (adminId === undefined && userId === undefined) {
      throw new HttpException('You must provide adminId or userId', 500);
    }

    if (
      adminId !== undefined &&
      !(await this.hasSchoolByAdmin({ adminId, schoolId }))
    ) {
      throw new HttpException('The admin does not have this school', 500);
    }

    if (
      userId !== undefined &&
      !(await this.hasSchoolByUser({ userId, schoolId }))
    ) {
      throw new HttpException('The user does not have this school', 500);
    }

    const newsList = await this.databaseService.news.findMany({
      where: { schoolId, deletedAt: { isSet: false } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalPage = Math.ceil(
      (await this.databaseService.news.count({
        where: { schoolId, deletedAt: { isSet: false } },
      })) / limit,
    );

    return { newsList, totalPage };
  }

  private async hasSchoolByAdmin({
    adminId,
    schoolId,
  }: {
    adminId: string;
    schoolId: string;
  }): Promise<boolean> {
    const admin = await this.databaseService.admin.findUnique({
      where: { id: adminId, schoolId },
    });

    return admin !== null && admin.schoolId !== null;
  }

  private async hasSchoolByUser({
    userId,
    schoolId,
  }: {
    userId: string;
    schoolId: string;
  }): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
        subscribtions: { some: { schoolId } },
      },
      include: { subscribtions: true },
    });

    return user !== null && user.subscribtions.length > 0;
  }

  private async createSubscribedNews(news: NewsEntity): Promise<void> {
    const subscribtions = await this.databaseService.subscribtion.findMany({
      where: {
        schoolId: news.schoolId,
        createdAt: {
          lte: news.createdAt,
        },
        deletedAt: { isSet: false },
      },
    });

    if (subscribtions.length === 0) return;

    await this.databaseService.subscribedNews.createMany({
      data: subscribtions.map((subscribtion) => ({
        newsId: news.id,
        userId: subscribtion.userId,
        createdAt: news.createdAt,
      })),
    });
  }

  private async removeSubscribedNews(news: NewsEntity): Promise<void> {
    await this.databaseService.subscribedNews.updateMany({
      where: { newsId: news.id },
      data: { deletedAt: news.deletedAt },
    });
  }
}
