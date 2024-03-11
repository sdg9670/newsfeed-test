import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class SubscribtionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  schoolId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;
}

export class GetSubscribtionsQuery {
  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
}

export class GetSubscribtionsPaginationResponseBody {
  @ApiProperty({ type: [SubscribtionEntity] })
  subscribtions: SubscribtionEntity[];

  @ApiProperty()
  totalPage: number;
}
