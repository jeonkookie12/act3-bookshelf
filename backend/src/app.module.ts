import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './category.entity';
import { Book } from './book.entity';

/**
 * Root application module
 * Configures the main application dependencies, database connection, and feature modules
 */
@Module({
  imports: [
    // Configure global ConfigModule to access environment variables
    ConfigModule.forRoot({ isGlobal: true }),
    // Configure TypeORM database connection asynchronously using environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Category, Book], // Register entity classes
        synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true', // Automatically sync database schema (use with caution in production)
      }),
      inject: [ConfigService],
    }),
    // Import feature modules
    BooksModule,        // Book management functionality
    CategoriesModule,  // Category/genre management functionality
  ],
})
export class AppModule {}