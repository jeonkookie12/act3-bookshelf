import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for creating a new book
 * Defines the structure of data required to create a book
 * Includes validation decorators to ensure data integrity
 */
export class CreateBookDto {
  /**
   * Book title - required
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Book author - required
   */
  @IsString()
  @IsNotEmpty()
  author: string;

  /**
   * Book description - required
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Book genre/category - required
   * Must match an existing category or will create a new one
   */
  @IsString()
  @IsNotEmpty()
  genre: string;
}