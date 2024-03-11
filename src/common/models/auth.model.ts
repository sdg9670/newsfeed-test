import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAdminRequestBody {
  @ApiProperty()
  @IsString()
  email: string;
}

export class LoginUserRequestBody {
  @ApiProperty()
  @IsString()
  email: string;
}

export class AuthEntity {
  admin: {
    id: string;
    email: string;
  };
  user: {
    id: string;
    email: string;
  };
}
