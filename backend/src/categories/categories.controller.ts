import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Categories controller
 * Handles all HTTP requests related to category/genre management
 * All endpoints are prefixed with '/categories'
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories
   * Retrieves all categories with their associated books
   * @returns {Promise<Category[]>} Array of categories with books
   */
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * POST /categories
   * Creates a new category/genre
   * @param {CreateCategoryDto} createCategoryDto - Category data from the request body
   * @returns {Promise<Category>} The newly created category
   */
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * PATCH /categories/:genre
   * Updates an existing category by genre name
   * @param {string} genre - The genre name from the URL parameter
   * @param {UpdateCategoryDto} updateCategoryDto - Category data to update
   * @returns {Promise<Category>} The updated category
   */
  @Patch(':genre')
  async update(@Param('genre') genre: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(genre, updateCategoryDto);
  }

  /**
   * DELETE /categories/:genre
   * Deletes a category and all its associated books
   * @param {string} genre - The genre name from the URL parameter
   * @returns {Promise<{message: string}>} Success message
   */
  @Delete(':genre')
  async delete(@Param('genre') genre: string) {
    return this.categoriesService.delete(genre);
  }
}