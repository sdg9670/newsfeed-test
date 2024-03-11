import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  LoginAdminRequestBody,
  LoginUserRequestBody,
} from '../common/models/auth.model';
import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/rolesGuard.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/models/role.model';

@Controller('auth')
@UseGuards(RolesGuard)
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: '관리자로 로그인합니다.' })
  @ApiResponse({ status: 201, type: String })
  async loginAdmin(
    @Body() body: LoginAdminRequestBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const { email } = body;
    const id = await this.authService.loginAdmin(email);

    response.cookie('admin-auth', JSON.stringify({ email, id }, null, 0), {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
    });

    return id;
  }

  @Post('admin/logout')
  @Roles([ROLE.ADMIN])
  @ApiOperation({ summary: '관리자로 로그아웃합니다.' })
  logoutAdmin(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('admin-auth');
  }

  @Post('user/login')
  @ApiOperation({ summary: '유저로 로그인합니다.' })
  @ApiResponse({ status: 201, type: String })
  async loginUser(
    @Body() body: LoginUserRequestBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const { email } = body;
    const id = await this.authService.loginUser(email);

    response.cookie('user-auth', JSON.stringify({ email, id }, null, 0), {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
    });

    return id;
  }

  @Post('user/logout')
  @Roles([ROLE.USER])
  @ApiOperation({ summary: '유저로 로그아웃합니다.' })
  logoutUser(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('user-auth');
  }
}
