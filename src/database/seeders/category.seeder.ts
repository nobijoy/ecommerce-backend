import { DataSource } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export async function seedCategories(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    // Check if categories already exist
    const existingCategories = await categoryRepository.count();
    if (existingCategories > 0) {
        console.log('Categories already seeded, skipping...');
        return;
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
    ];

    for (const categoryData of categories) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
    }

    console.log('✅ Categories seeded successfully');
}
