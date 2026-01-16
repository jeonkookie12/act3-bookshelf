import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for updating an existing category/genre
 * Defines the structure of data required to update a category
 * Includes validation decorators to ensure data integrity
 */
export class UpdateCategoryDto {
  /**
   * New category/genre name - required
   * Will be normalized to uppercase and trimmed
   */
  @IsString()
  @IsNotEmpty()
  genre: string;
}