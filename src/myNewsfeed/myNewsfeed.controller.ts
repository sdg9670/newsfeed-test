import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/rolesGuard.guard';
import { ROLE } from '../common/models/role.model';
import {
  GetMyNewsfeedQuery,
  GetMyNewsfeedResponseBody,
} from '../common/models/newsfeed.model';
import { Auth } from '../common/decorators/auth.decorator';
import { AuthEntity } from '../common/models/auth.model';
import { MyNewsfeedService } from './myNewsfeed.service';

@Controller('users/my/newsfeed')
@UseGuards(RolesGuard)
@ApiTags('my newsfeed')
export class MyNewsfeedController {
  constructor(private readonly myNewsfeedService: MyNewsfeedService) {}

  @Get('/news')
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '내 뉴스피드에 있는 뉴스들을 가져옵니다.' })
  @ApiResponse({ status: 200, type: GetMyNewsfeedResponseBody })
  async getMyNewsfeed(
    @Auth() auth: AuthEntity,
    @Query() query: GetMyNewsfeedQuery,
  ): Promise<GetMyNewsfeedResponseBody> {
    return await this.myNewsfeedService.getMyNewsfeed({
      userId: auth.user.id,
      page: query.page,
      limit: query.limit,
    });
  }
}
