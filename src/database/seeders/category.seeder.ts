import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export async function seedCategories(dataSource: DataSource, refresh: boolean = false): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    // Check if categories already exist
    const existingCategories = await categoryRepository.count();
    if (existingCategories > 0 && !refresh) {
        console.log('Categories already seeded, skipping...');
        return;
    }

    if (refresh && existingCategories > 0) {
        try {
            await dataSource.query('DELETE FROM category');
            console.log('Cleared existing categories');
        } catch (error) {
            // Table might not exist yet
        }
    }

    const categories = [
        {
            name: 'Electronics',
            description: 'Electronic devices and accessories',
        },
        {
            name: 'Clothing',
            description: 'Fashion and apparel',
        },
        {
            name: 'Books',
            description: 'Books and educational materials',
        },
        {
            name: 'Home & Garden',
            description: 'Home improvement and garden supplies',
        },
        {
            name: 'Sports & Outdoors',
            description: 'Sports equipment and outdoor gear',
        },
        {
            name: 'Beauty & Personal Care',
            description: 'Skincare, cosmetics, and personal care products',
        },
        {
            name: 'Toys & Games',
            description: 'Toys, board games, and entertainment',
        },
        {
            name: 'Food & Beverages',
            description: 'Snacks, beverages, and gourmet foods',
        },
        {
            name: 'Furniture',
            description: 'Home furniture and decor',
        },
        {
            name: 'Automotive',
            description: 'Car accessories and automotive products',
        },
    ];

    for (const categoryData of categories) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
    }

    console.log('✅ Categories seeded successfully');
}
