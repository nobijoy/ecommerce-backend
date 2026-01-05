import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private readonly cartService: CartService,
        private readonly productsService: ProductsService,
    ) { }

    async create(userId: string): Promise<Order> {
        const cart = await this.cartService.getCart(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Calculate total price and validate stock
        let totalPrice = 0;
        for (const item of cart.items) {
            const product = await this.productsService.findOne(item.productId);

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for product: ${product.name}`,
                );
            }

            totalPrice += Number(product.price) * item.quantity;
        }

        // Create order
        const order = this.orderRepository.create({
            userId,
            totalPrice,
            status: OrderStatus.PENDING,
        });

        const savedOrder = await this.orderRepository.save(order);

        // Create order items and decrease stock
        for (const item of cart.items) {
            const product = await this.productsService.findOne(item.productId);

            const orderItem = this.orderItemRepository.create({
                orderId: savedOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });

            await this.orderItemRepository.save(orderItem);
            await this.productsService.decreaseStock(item.productId, item.quantity);
        }

        // Clear cart
        await this.cartService.clearCart(userId);

        return this.findOne(savedOrder.id);
    }

    async findAll(userId: string): Promise<Order[]> {
        return this.orderRepository.find({
            where: { userId },
            relations: ['items', 'items.product', 'payment'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'items.product.category', 'payment'],
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async updateStatus(
        id: string,
        updateOrderStatusDto: UpdateOrderStatusDto,
    ): Promise<Order> {
        const order = await this.findOne(id);

        order.status = updateOrderStatusDto.status;
        await this.orderRepository.save(order);

        return this.findOne(id);
    }

    async cancel(id: string, userId: string): Promise<Order> {
        const order = await this.findOne(id);

        if (order.userId !== userId) {
            throw new BadRequestException('You can only cancel your own orders');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Only pending orders can be cancelled');
        }

        // Restore stock
        for (const item of order.items) {
            await this.productsService.increaseStock(item.productId, item.quantity);
        }

        order.status = OrderStatus.CANCELLED;
        await this.orderRepository.save(order);

        return this.findOne(id);
    }
}
