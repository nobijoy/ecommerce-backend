import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsPositive,
    IsInt,
    Min,
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Wireless Mouse' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Ergonomic wireless mouse with USB receiver' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 29.99 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ example: 100 })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 'WM-001' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 'uuid-of-category' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
}
