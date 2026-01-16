import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for creating a new category/genre
 * Defines the structure of data required to create a category
 * Includes validation decorators to ensure data integrity
 */
export class CreateCategoryDto {
  /**
   * Category/genre name - required
   * Will be normalized to uppercase and trimmed
   */
  @IsString()
  @IsNotEmpty()
  genre: string;
}