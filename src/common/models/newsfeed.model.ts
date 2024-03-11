import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NewsEntity } from './news.model';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetMyNewsfeedQuery {
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

export class GetMyNewsfeedResponseBody {
  @ApiProperty({ type: [NewsEntity] })
  newsList: NewsEntity[];

  @ApiProperty()
  totalPage: number;
}
