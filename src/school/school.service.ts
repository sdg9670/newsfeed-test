import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/database/database.service';
import { SchoolEntity } from '../common/models/school.model';

@Injectable()
export class SchoolService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createSchool(data: {
    name: string;
    location: string;
    adminId: string;
  }): Promise<SchoolEntity> {
    const admin = await this.databaseService.admin.findUnique({
      where: { id: data.adminId },
    });

    if (!admin) {
      throw new HttpException('The admin does not exist', 500);
    }

    if (admin.schoolId) {
      throw new HttpException('The admin already has a school', 500);
    }

    let school = await this.databaseService.school.findUnique({
      where: { name_location: { name: data.name, location: data.location } },
    });
    if (school) {
      throw new HttpException('The school already exists', 500);
    }

    school = await this.databaseService.school.create({
      data: {
        name: data.name,
        location: data.location,
      },
    });
    await this.databaseService.admin.update({
      where: { id: data.adminId },
      data: { schoolId: school.id },
    });

    return school;
  }
}
