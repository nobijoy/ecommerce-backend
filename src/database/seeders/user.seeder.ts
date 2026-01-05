import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';

config();

const configService = new ConfigService();

export async function seedUsers(dataSource: DataSource, refresh: boolean = false): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0 && !refresh) {
        console.log('Users already seeded, skipping...');
        return;
    }

    if (refresh && existingUsers > 0) {
        try {
            await dataSource.query('DELETE FROM "user"');
            console.log('Cleared existing users');
        } catch (error) {
            // Table might not exist yet
        }
    }

    const users = [
        {
            email: 'admin@example.com',
            password: await bcrypt.hash('Admin123!', 10),
            firstName: 'Admin',
            lastName: 'User',
        },
        {
            email: 'john.doe@example.com',
            password: await bcrypt.hash('Password123!', 10),
            firstName: 'John',
            lastName: 'Doe',
        },
        {
            email: 'jane.smith@example.com',
            password: await bcrypt.hash('Password123!', 10),
            firstName: 'Jane',
            lastName: 'Smith',
        },
    ];

    for (const userData of users) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
    }

    console.log('✅ Users seeded successfully');
}
