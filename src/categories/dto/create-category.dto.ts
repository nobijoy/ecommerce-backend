import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Electronic devices and accessories' })
    @IsString()
    @IsOptional()
    description?: string;
}
