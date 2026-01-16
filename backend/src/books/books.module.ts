import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { CategoriesModule } from '../categories/categories.module';
import { Book } from '../book.entity';
import { Category } from '../category.entity';

/**
 * Books module
 * Configures the books feature module with its dependencies
 */
@Module({
  // Register Book and Category entities with TypeORM and import CategoriesModule
  imports: [TypeOrmModule.forFeature([Book, Category]), CategoriesModule],
  // Register the BooksController to handle HTTP requests
  controllers: [BooksController],
  // Register the BooksService as a provider
  providers: [BooksService],
})
export class BooksModule {}