import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column({ unique: true })
    sku: string;

    @Column({ name: 'category_id' })
    categoryId: string;

    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems: CartItem[];

    @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
    orderItems: OrderItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
