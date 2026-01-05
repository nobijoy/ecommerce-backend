import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: 'John' })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsString()
    @IsOptional()
    lastName?: string;
}
