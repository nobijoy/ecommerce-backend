import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly categoriesService: CategoriesService,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        // Verify category exists
        await this.categoriesService.findOne(createProductDto.categoryId);

        // Check SKU uniqueness
        const existingProduct = await this.productRepository.findOne({
            where: { sku: createProductDto.sku },
        });

        if (existingProduct) {
            throw new ConflictException('SKU already exists');
        }

        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        categoryId?: string,
    ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;

        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .skip(skip)
            .take(limit);

        if (categoryId) {
            queryBuilder.where('product.categoryId = :categoryId', { categoryId });
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        if (updateProductDto.categoryId) {
            await this.categoriesService.findOne(updateProductDto.categoryId);
        }

        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.productRepository.findOne({
                where: { sku: updateProductDto.sku },
            });

            if (existingProduct) {
                throw new ConflictException('SKU already exists');
            }
        }

        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }

    async decreaseStock(id: string, quantity: number): Promise<void> {
        const product = await this.findOne(id);

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        product.stock -= quantity;
        await this.productRepository.save(product);
    }

    async increaseStock(id: string, quantity: number): Promise<void> {
        const product = await this.findOne(id);
        product.stock += quantity;
        await this.productRepository.save(product);
    }
}
