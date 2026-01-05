import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
