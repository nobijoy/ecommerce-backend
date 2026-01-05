import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update category' })
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete category' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
