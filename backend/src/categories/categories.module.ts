import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from '../category.entity';
import { Book } from '../book.entity'; 

/**
 * Categories module
 * Configures the categories feature module with its dependencies
 * Exports CategoriesService for use in other modules (e.g., BooksModule)
 */
@Module({
  // Register Category and Book entities with TypeORM for this module
  imports: [TypeOrmModule.forFeature([Category, Book])], 
  // Register the CategoriesController to handle HTTP requests
  controllers: [CategoriesController],
  // Register the CategoriesService as a provider
  providers: [CategoriesService],
  // Export CategoriesService so other modules can use it
  exports: [CategoriesService],
})
export class CategoriesModule {}