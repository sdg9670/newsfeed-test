import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async loginAdmin(email: string): Promise<string> {
    const admin = await this.databaseService.admin.findUnique({
      where: {
        email,
      },
    });

    if (admin === null) throw new HttpException('The email not found', 500);

    return admin.id;
  }

  async loginUser(email: string): Promise<string> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    if (user === null) throw new HttpException('The email not found', 500);

    return user.id;
  }
}
