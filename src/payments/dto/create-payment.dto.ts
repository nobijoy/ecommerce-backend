import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty({ example: 'uuid-of-order' })
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ example: 'credit_card' })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
}
