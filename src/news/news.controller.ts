import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/rolesGuard.guard';
import { NewsService } from './news.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/models/role.model';
import {
  CreateNewsRequestBody,
  GetNewsListQuery,
  GetNewsListResponseBody,
  NewsEntity,
  UpdateNewsRequestBody,
} from '../common/models/news.model';
import { Auth } from '../common/decorators/auth.decorator';
import { AuthEntity } from '../common/models/auth.model';

@Controller('schools/:schoolId/news')
@UseGuards(RolesGuard)
@ApiTags('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '뉴스를 생성합니다.' })
  @ApiResponse({ status: 201, type: NewsEntity })
  async createNews(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
    @Body() body: CreateNewsRequestBody,
  ): Promise<NewsEntity> {
    return await this.newsService.createNews({
      schoolId,
      title: body.title,
      content: body.content,
      adminId: auth.admin.id,
    });
  }

  @Put(':newsId')
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '뉴스를 수정합니다.' })
  @ApiResponse({ status: 200, type: NewsEntity })
  async updateNews(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
    @Param('newsId') newsId: string,
    @Body() body: UpdateNewsRequestBody,
  ): Promise<NewsEntity> {
    return await this.newsService.updateNews({
      schoolId,
      newsId,
      title: body.title,
      content: body.content,
      adminId: auth.admin.id,
    });
  }

  @Delete(':newsId')
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '뉴스를 삭제합니다.' })
  @ApiResponse({ status: 200, type: NewsEntity })
  async removeNews(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
    @Param('newsId') newsId: string,
  ): Promise<NewsEntity> {
    return await this.newsService.removeNews({
      schoolId,
      newsId,
      adminId: auth.admin.id,
    });
  }

  @Get('admin')
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '관리자가 볼 수 있는 뉴스들을 가져옵니다.' })
  @ApiResponse({ status: 200, type: [GetNewsListResponseBody] })
  async getNewsListByAdmin(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
    @Query() query: GetNewsListQuery,
  ): Promise<GetNewsListResponseBody> {
    return await this.newsService.getNewsList({
      adminId: auth.admin.id,
      schoolId,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('user')
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '유저가 볼 수 있는 뉴스들을 가져옵니다.' })
  @ApiResponse({ status: 200, type: [GetNewsListResponseBody] })
  async getNewsListByUser(
    @Auth() auth: AuthEntity,
    @Param('schoolId') schoolId: string,
    @Query() query: GetNewsListQuery,
  ): Promise<GetNewsListResponseBody> {
    return await this.newsService.getNewsList({
      userId: auth.user.id,
      schoolId,
      page: query.page,
      limit: query.limit,
    });
  }
}
