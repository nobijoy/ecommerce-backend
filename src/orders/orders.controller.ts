import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create order from cart' })
    create(@CurrentUser() user: User, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user orders' })
    findAll(@CurrentUser() user: User) {
        return this.ordersService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status (admin)' })
    updateStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, updateOrderStatusDto);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel order' })
    cancel(@CurrentUser() user: User, @Param('id') id: string) {
        return this.ordersService.cancel(id, user.id);
    }
}
