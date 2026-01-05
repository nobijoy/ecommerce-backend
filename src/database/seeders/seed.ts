import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedUsers } from './user.seeder';
import { seedCategories } from './category.seeder';
import { seedProducts } from './product.seeder';

config();

async function runSeeders() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'ecommerce',
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
    });

    try {
        await dataSource.initialize();
        console.log('📦 Database connection established');

        console.log('\n🌱 Starting database seeding...\n');

        await seedUsers(dataSource);
        await seedCategories(dataSource);
        await seedProducts(dataSource);

        console.log('\n✨ Database seeding completed successfully!\n');
        console.log('📝 Test credentials:');
        console.log('   Email: admin@example.com');
        console.log('   Password: Admin123!\n');

        await dataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        await dataSource.destroy();
        process.exit(1);
    }
}

runSeeders();
