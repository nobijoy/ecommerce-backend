import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get current user cart' })
    getCart(@CurrentUser() user: User) {
        return this.cartService.getCart(user.id);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    addToCart(@CurrentUser() user: User, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(user.id, addToCartDto);
    }

    @Patch('items/:itemId')
    @ApiOperation({ summary: 'Update cart item quantity' })
    updateCartItem(
        @CurrentUser() user: User,
        @Param('itemId') itemId: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(user.id, itemId, updateCartItemDto);
    }

    @Delete('items/:itemId')
    @ApiOperation({ summary: 'Remove item from cart' })
    removeFromCart(@CurrentUser() user: User, @Param('itemId') itemId: string) {
        return this.cartService.removeFromCart(user.id, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear cart' })
    clearCart(@CurrentUser() user: User) {
        return this.cartService.clearCart(user.id);
    }
}
