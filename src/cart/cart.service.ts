import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
        private readonly productsService: ProductsService,
    ) { }

    async getOrCreateCart(userId: string): Promise<Cart> {
        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            cart = this.cartRepository.create({ userId });
            cart = await this.cartRepository.save(cart);
        }

        return cart;
    }

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
        const product = await this.productsService.findOne(addToCartDto.productId);

        if (product.stock < addToCartDto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const cart = await this.getOrCreateCart(userId);

        // Check if product already in cart
        const existingItem = cart.items?.find(
            (item) => item.productId === addToCartDto.productId,
        );

        if (existingItem) {
            existingItem.quantity += addToCartDto.quantity;
            await this.cartItemRepository.save(existingItem);
        } else {
            const cartItem = this.cartItemRepository.create({
                cartId: cart.id,
                productId: addToCartDto.productId,
                quantity: addToCartDto.quantity,
            });
            await this.cartItemRepository.save(cartItem);
        }

        return this.getCart(userId);
    }

    async getCart(userId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product', 'items.product.category'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    }

    async updateCartItem(
        userId: string,
        itemId: string,
        updateCartItemDto: UpdateCartItemDto,
    ): Promise<Cart> {
        const cart = await this.getCart(userId);

        const cartItem = cart.items.find((item) => item.id === itemId);

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        const product = await this.productsService.findOne(cartItem.productId);

        if (product.stock < updateCartItemDto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        cartItem.quantity = updateCartItemDto.quantity;
        await this.cartItemRepository.save(cartItem);

        return this.getCart(userId);
    }

    async removeFromCart(userId: string, itemId: string): Promise<Cart> {
        const cart = await this.getCart(userId);

        const cartItem = cart.items.find((item) => item.id === itemId);

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartItemRepository.remove(cartItem);

        return this.getCart(userId);
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.remove(cart.items);
    }
}
