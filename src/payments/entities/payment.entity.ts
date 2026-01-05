import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id', unique: true })
    orderId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
