import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with pagination' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiQuery({ name: 'categoryId', required: false })
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('categoryId') categoryId?: string,
    ) {
        return this.productsService.findAll(page, limit, categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
