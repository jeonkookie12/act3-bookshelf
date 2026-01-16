import { IsString, IsOptional } from 'class-validator';

/**
 * Data Transfer Object for updating an existing book
 * All fields are optional, allowing partial updates
 * Includes validation decorators to ensure data integrity
 */
export class UpdateBookDto {
  /**
   * Book title - optional
   */
  @IsString()
  @IsOptional()
  title?: string;

  /**
   * Book author - optional
   */
  @IsString()
  @IsOptional()
  author?: string;

  /**
   * Book description - optional
   */
  @IsString()
  @IsOptional()
  description?: string;
}