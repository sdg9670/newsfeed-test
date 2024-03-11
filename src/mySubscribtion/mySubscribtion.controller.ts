import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/rolesGuard.guard';
import { ROLE } from '../common/models/role.model';
import { Auth } from '../common/decorators/auth.decorator';
import { AuthEntity } from '../common/models/auth.model';
import { MySubscribtionService } from './mySubscribtion.service';
import {
  GetSubscribtionsPaginationResponseBody,
  GetSubscribtionsQuery,
  SubscribtionEntity,
} from '../common/models/subscribtion.model';

@Controller('users/my/subscribtions')
@UseGuards(RolesGuard)
@ApiTags('my subscribtions')
export class MySubscribtionController {
  constructor(private readonly mySubscribtionService: MySubscribtionService) {}

  @Get()
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '내가 구독한 학교 페이지들을 가져옵니다.' })
  @ApiResponse({ status: 200, type: GetSubscribtionsPaginationResponseBody })
  async getMySubscribtions(
    @Auth() auth: AuthEntity,
    @Query() query: GetSubscribtionsQuery,
  ): Promise<GetSubscribtionsPaginationResponseBody> {
    const subscribtions = await this.mySubscribtionService.getMySubscribtions({
      userId: auth.user.id,
      page: query.page,
      limit: query.limit,
    });

    return subscribtions;
  }

  @Post(':schoolId')
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '학교 페이지를 구독합니다.' })
  @ApiResponse({ status: 201, type: SubscribtionEntity })
  async subscribe(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
  ): Promise<SubscribtionEntity> {
    const subscribtion = await this.mySubscribtionService.subscribe({
      userId: auth.user.id,
      schoolId,
    });

    return subscribtion;
  }

  @Delete(':schoolId')
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '학교 페이지를 구독 해지합니다.' })
  @ApiResponse({ status: 200, type: SubscribtionEntity })
  async unsubscribe(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
  ): Promise<SubscribtionEntity> {
    const subscribtion = await this.mySubscribtionService.unsubscribe({
      userId: auth.user.id,
      schoolId,
    });

    return subscribtion;
  }
}
