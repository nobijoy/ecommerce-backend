import { DataSource } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';

export async function seedProducts(dataSource: DataSource, refresh: boolean = false): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0 && !refresh) {
        console.log('Products already seeded, skipping...');
        return;
    }

    if (refresh && existingProducts > 0) {
        try {
            await dataSource.query('DELETE FROM product');
            console.log('Cleared existing products');
        } catch (error) {
            // Table might not exist yet
        }
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
    const beauty = await categoryRepository.findOne({
        where: { name: 'Beauty & Personal Care' },
    });
    const toys = await categoryRepository.findOne({
        where: { name: 'Toys & Games' },
    });
    const food = await categoryRepository.findOne({
        where: { name: 'Food & Beverages' },
    });
    const furniture = await categoryRepository.findOne({
        where: { name: 'Furniture' },
    });
    const automotive = await categoryRepository.findOne({
        where: { name: 'Automotive' },
    });

    if (!electronics || !clothing || !books || !homeGarden || !sports || !beauty || !toys || !food || !furniture || !automotive) {
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
        {
            name: '4K Webcam',
            description: 'Ultra HD 4K webcam with auto-focus and noise cancellation',
            price: 129.99,
            stock: 40,
            sku: 'ELEC-WC-001',
            categoryId: electronics.id,
        },
        {
            name: 'Portable SSD 1TB',
            description: 'Fast portable SSD with 1TB storage capacity',
            price: 149.99,
            stock: 60,
            sku: 'ELEC-SSD-001',
            categoryId: electronics.id,
        },
        {
            name: 'Wireless Charger',
            description: 'Fast wireless charging pad for smartphones',
            price: 34.99,
            stock: 120,
            sku: 'ELEC-CHG-001',
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
        {
            name: 'Hoodie Sweatshirt',
            description: 'Warm and cozy hoodie sweatshirt',
            price: 59.99,
            stock: 80,
            sku: 'CLTH-HD-001',
            categoryId: clothing.id,
        },
        {
            name: 'Running Shoes',
            description: 'Lightweight running shoes with cushioning',
            price: 99.99,
            stock: 70,
            sku: 'CLTH-RS-001',
            categoryId: clothing.id,
        },
        {
            name: 'Winter Jacket',
            description: 'Waterproof winter jacket with insulation',
            price: 149.99,
            stock: 45,
            sku: 'CLTH-WJ-001',
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
        {
            name: 'Design Patterns',
            description: 'Elements of reusable object-oriented software',
            price: 54.99,
            stock: 40,
            sku: 'BOOK-DP-001',
            categoryId: books.id,
        },
        {
            name: 'The Pragmatic Programmer',
            description: 'Your journey to mastery in software development',
            price: 44.99,
            stock: 55,
            sku: 'BOOK-PP-001',
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
        {
            name: 'Garden Tool Set',
            description: 'Complete garden tool set with 10 tools',
            price: 59.99,
            stock: 50,
            sku: 'HOME-GT-001',
            categoryId: homeGarden.id,
        },
        {
            name: 'Throw Pillow',
            description: 'Decorative throw pillow with soft fabric',
            price: 24.99,
            stock: 100,
            sku: 'HOME-TP-001',
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
        {
            name: 'Dumbbells Set',
            description: 'Adjustable dumbbells set 5-25 lbs',
            price: 89.99,
            stock: 35,
            sku: 'SPRT-DB-001',
            categoryId: sports.id,
        },
        {
            name: 'Resistance Bands',
            description: 'Set of 5 resistance bands with different strengths',
            price: 19.99,
            stock: 110,
            sku: 'SPRT-RB-001',
            categoryId: sports.id,
        },
        // Beauty & Personal Care
        {
            name: 'Facial Moisturizer',
            description: 'Hydrating facial moisturizer for all skin types',
            price: 34.99,
            stock: 85,
            sku: 'BEAUT-FM-001',
            categoryId: beauty.id,
        },
        {
            name: 'Shampoo & Conditioner Set',
            description: 'Professional hair care shampoo and conditioner',
            price: 29.99,
            stock: 95,
            sku: 'BEAUT-SC-001',
            categoryId: beauty.id,
        },
        {
            name: 'Makeup Brush Set',
            description: 'Professional makeup brush set with 15 brushes',
            price: 44.99,
            stock: 60,
            sku: 'BEAUT-MB-001',
            categoryId: beauty.id,
        },
        {
            name: 'Lip Balm Collection',
            description: 'Set of 5 natural lip balms with different flavors',
            price: 14.99,
            stock: 150,
            sku: 'BEAUT-LB-001',
            categoryId: beauty.id,
        },
        // Toys & Games
        {
            name: 'Board Game Collection',
            description: 'Classic board games set for family fun',
            price: 49.99,
            stock: 40,
            sku: 'TOYS-BG-001',
            categoryId: toys.id,
        },
        {
            name: 'Building Blocks Set',
            description: '1000 piece building blocks set for creative play',
            price: 39.99,
            stock: 70,
            sku: 'TOYS-BB-001',
            categoryId: toys.id,
        },
        {
            name: 'Puzzle 1000 Pieces',
            description: 'Scenic landscape puzzle with 1000 pieces',
            price: 19.99,
            stock: 100,
            sku: 'TOYS-PZ-001',
            categoryId: toys.id,
        },
        // Food & Beverages
        {
            name: 'Organic Coffee Beans',
            description: 'Premium organic coffee beans 1kg',
            price: 24.99,
            stock: 120,
            sku: 'FOOD-CB-001',
            categoryId: food.id,
        },
        {
            name: 'Green Tea Collection',
            description: 'Assorted green tea collection with 20 tea bags',
            price: 14.99,
            stock: 140,
            sku: 'FOOD-GT-001',
            categoryId: food.id,
        },
        {
            name: 'Gourmet Chocolate Box',
            description: 'Premium gourmet chocolate assortment',
            price: 34.99,
            stock: 80,
            sku: 'FOOD-CH-001',
            categoryId: food.id,
        },
        // Furniture
        {
            name: 'Office Chair',
            description: 'Ergonomic office chair with lumbar support',
            price: 199.99,
            stock: 25,
            sku: 'FURN-OC-001',
            categoryId: furniture.id,
        },
        {
            name: 'Standing Desk',
            description: 'Adjustable standing desk with electric motor',
            price: 299.99,
            stock: 20,
            sku: 'FURN-SD-001',
            categoryId: furniture.id,
        },
        {
            name: 'Bookshelf',
            description: 'Wooden bookshelf with 5 shelves',
            price: 129.99,
            stock: 30,
            sku: 'FURN-BS-001',
            categoryId: furniture.id,
        },
        // Automotive
        {
            name: 'Car Phone Mount',
            description: 'Dashboard car phone mount with strong grip',
            price: 19.99,
            stock: 150,
            sku: 'AUTO-PM-001',
            categoryId: automotive.id,
        },
        {
            name: 'Car Air Freshener',
            description: 'Hanging car air freshener with various scents',
            price: 9.99,
            stock: 200,
            sku: 'AUTO-AF-001',
            categoryId: automotive.id,
        },
        {
            name: 'Tire Pressure Gauge',
            description: 'Digital tire pressure gauge with LCD display',
            price: 24.99,
            stock: 90,
            sku: 'AUTO-TP-001',
            categoryId: automotive.id,
        },
    ];

    for (const productData of products) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
    }

    console.log('✅ Products seeded successfully');
}
