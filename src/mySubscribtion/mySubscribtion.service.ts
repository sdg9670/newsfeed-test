import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import {
  GetSubscribtionsPaginationResponseBody,
  SubscribtionEntity,
} from '../common/models/subscribtion.model';

@Injectable()
export class MySubscribtionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getMySubscribtions({
    userId,
    page,
    limit,
  }: {
    userId: string;
    page: number;
    limit: number;
  }): Promise<GetSubscribtionsPaginationResponseBody> {
    const subscribtions = await this.databaseService.subscribtion.findMany({
      where: {
        userId,
        deletedAt: { isSet: false },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPage = Math.ceil(
      (await this.databaseService.subscribtion.count({
        where: {
          userId,
          deletedAt: { isSet: false },
        },
      })) / limit,
    );

    return {
      subscribtions,
      totalPage,
    };
  }

  async subscribe({
    userId,
    schoolId,
  }: {
    userId: string;
    schoolId: string;
  }): Promise<SubscribtionEntity> {
    const subscribtion = await this.databaseService.subscribtion.findFirst({
      where: {
        userId,
        schoolId,
        deletedAt: { isSet: false },
      },
    });

    if (subscribtion !== null) {
      throw new HttpException('You already subscribed this school', 500);
    }

    return await this.databaseService.subscribtion.create({
      data: {
        userId,
        schoolId,
      },
    });
  }

  async unsubscribe({
    userId,
    schoolId,
  }: {
    userId: string;
    schoolId: string;
  }): Promise<SubscribtionEntity> {
    const subscribtion = await this.databaseService.subscribtion.findFirst({
      where: {
        userId,
        schoolId,
        deletedAt: { isSet: false },
      },
    });
    if (subscribtion === null) {
      throw new HttpException('You did not subscribe this school', 500);
    }

    const deletedAt = new Date();
    await this.databaseService.subscribtion.updateMany({
      where: {
        userId,
        schoolId,
        deletedAt: { isSet: false },
      },
      data: {
        deletedAt,
      },
    });

    return { ...subscribtion, deletedAt };
  }
}
