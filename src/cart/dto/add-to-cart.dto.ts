import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty({ example: 'uuid-of-product' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    quantity: number;
}
