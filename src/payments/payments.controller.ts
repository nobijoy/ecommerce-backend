import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    @ApiOperation({ summary: 'Process payment for order' })
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentsService.create(createPaymentDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get payment by ID' })
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @Get('order/:orderId')
    @ApiOperation({ summary: 'Get payment by order ID' })
    findByOrderId(@Param('orderId') orderId: string) {
        return this.paymentsService.findByOrderId(orderId);
    }
}
