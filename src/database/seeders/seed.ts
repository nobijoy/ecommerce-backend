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

        // Check for refresh flag in process.argv
        const refresh = process.argv.some(arg => arg === '--refresh' || arg.includes('refresh'));
        console.log(`Refresh flag: ${refresh}`);

        // Clear existing data if --refresh flag is passed
        if (refresh) {
            console.log('\n🗑️  Clearing existing data...\n');
            try {
                // Disable foreign key constraints temporarily
                await dataSource.query('SET session_replication_role = replica');
                await dataSource.query('DELETE FROM products');
                await dataSource.query('DELETE FROM categories');
                await dataSource.query('DELETE FROM users');
                await dataSource.query('SET session_replication_role = default');
                console.log('✅ Data cleared\n');
            } catch (error) {
                console.log('ℹ️  No existing data to clear or error clearing:', error.message, '\n');
            }
        }

        console.log('\n🌱 Starting database seeding...\n');

        await seedUsers(dataSource, refresh);
        await seedCategories(dataSource, refresh);
        await seedProducts(dataSource, refresh);

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
