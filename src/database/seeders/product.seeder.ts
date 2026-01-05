import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
        console.log('Products already seeded, skipping...');
        return;
    }

    // Get categories
    const electronics = await categoryRepository.findOne({
        where: { name: 'Electronics' },
    });
    const clothing = await categoryRepository.findOne({
        where: { name: 'Clothing' },
    });
    const books = await categoryRepository.findOne({ where: { name: 'Books' } });
    const homeGarden = await categoryRepository.findOne({
        where: { name: 'Home & Garden' },
    });
    const sports = await categoryRepository.findOne({
        where: { name: 'Sports & Outdoors' },
    });

    if (!electronics || !clothing || !books || !homeGarden || !sports) {
        console.log('❌ Categories not found. Please run category seeder first.');
        return;
    }

    const products = [
        // Electronics
        {
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with USB receiver',
            price: 29.99,
            stock: 100,
            sku: 'ELEC-WM-001',
            categoryId: electronics.id,
        },
        {
            name: 'Mechanical Keyboard',
            description: 'RGB mechanical gaming keyboard with blue switches',
            price: 89.99,
            stock: 50,
            sku: 'ELEC-KB-001',
            categoryId: electronics.id,
        },
        {
            name: 'USB-C Hub',
            description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
            price: 39.99,
            stock: 75,
            sku: 'ELEC-HUB-001',
            categoryId: electronics.id,
        },
        // Clothing
        {
            name: 'Cotton T-Shirt',
            description: 'Comfortable cotton t-shirt in various colors',
            price: 19.99,
            stock: 200,
            sku: 'CLTH-TS-001',
            categoryId: clothing.id,
        },
        {
            name: 'Denim Jeans',
            description: 'Classic fit denim jeans',
            price: 49.99,
            stock: 150,
            sku: 'CLTH-JN-001',
            categoryId: clothing.id,
        },
        // Books
        {
            name: 'JavaScript: The Good Parts',
            description: 'Essential JavaScript programming guide',
            price: 24.99,
            stock: 80,
            sku: 'BOOK-JS-001',
            categoryId: books.id,
        },
        {
            name: 'Clean Code',
            description: 'A handbook of agile software craftsmanship',
            price: 34.99,
            stock: 60,
            sku: 'BOOK-CC-001',
            categoryId: books.id,
        },
        // Home & Garden
        {
            name: 'LED Desk Lamp',
            description: 'Adjustable LED desk lamp with touch control',
            price: 44.99,
            stock: 90,
            sku: 'HOME-LP-001',
            categoryId: homeGarden.id,
        },
        {
            name: 'Plant Pot Set',
            description: 'Set of 3 ceramic plant pots with drainage',
            price: 29.99,
            stock: 120,
            sku: 'HOME-PP-001',
            categoryId: homeGarden.id,
        },
        // Sports & Outdoors
        {
            name: 'Yoga Mat',
            description: 'Non-slip yoga mat with carrying strap',
            price: 34.99,
            stock: 100,
            sku: 'SPRT-YM-001',
            categoryId: sports.id,
        },
        {
            name: 'Water Bottle',
            description: 'Insulated stainless steel water bottle 750ml',
            price: 24.99,
            stock: 150,
            sku: 'SPRT-WB-001',
            categoryId: sports.id,
        },
    ];

    for (const productData of products) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
    }

    console.log('✅ Products seeded successfully');
}
