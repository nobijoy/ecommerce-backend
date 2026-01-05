import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly ordersService: OrdersService,
    ) { }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const order = await this.ordersService.findOne(createPaymentDto.orderId);

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Order is not in pending status');
        }

        // Check if payment already exists for this order
        const existingPayment = await this.paymentRepository.findOne({
            where: { orderId: createPaymentDto.orderId },
        });

        if (existingPayment) {
            throw new BadRequestException('Payment already exists for this order');
        }

        // Mock payment processing
        const payment = this.paymentRepository.create({
            orderId: createPaymentDto.orderId,
            amount: order.totalPrice,
            paymentMethod: createPaymentDto.paymentMethod,
            status: PaymentStatus.COMPLETED, // Mock: always successful
        });

        const savedPayment = await this.paymentRepository.save(payment);

        // Update order status to paid
        await this.ordersService.updateStatus(createPaymentDto.orderId, {
            status: OrderStatus.PAID,
        });

        return savedPayment;
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        return payment;
    }

    async findByOrderId(orderId: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { orderId },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException(`Payment for order ${orderId} not found`);
        }

        return payment;
    }
}
