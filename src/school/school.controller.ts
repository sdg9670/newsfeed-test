import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/rolesGuard.guard';
import { SchoolService } from './school.service';
import {
  CreateSchoolRequestBody,
  SchoolEntity,
} from '../common/models/school.model';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/models/role.model';
import { AuthEntity } from '../common/models/auth.model';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('schools')
@UseGuards(RolesGuard)
@ApiTags('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '학교 페이지를 생성합니다.' })
  @ApiResponse({ status: 201, type: SchoolEntity })
  async createSchool(
    @Auth() auth: AuthEntity,
    @Body() body: CreateSchoolRequestBody,
  ): Promise<SchoolEntity> {
    return await this.schoolService.createSchool({
      adminId: auth.admin.id,
      name: body.name,
      location: body.location,
    });
  }
}
