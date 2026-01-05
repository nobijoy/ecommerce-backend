import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @OneToOne(() => Payment, (payment) => payment.order)
    payment: Payment;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
