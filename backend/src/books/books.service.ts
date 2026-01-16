import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CategoriesService } from '../categories/categories.service';

/**
 * Books service
 * Contains all business logic for book management operations
 * Delegates to CategoriesService since books are organized by categories
 */
@Injectable()
export class BooksService {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Retrieves all categories with their books
   * @returns {Promise<Category[]>} Array of categories with their associated books
   */
  async findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * Creates a new book in the specified category
   * @param {CreateBookDto} createBookDto - Book data to create
   * @returns {Promise<Book>} The newly created book
   */
  async create(createBookDto: CreateBookDto) {
    return this.categoriesService.addBook(createBookDto);
  }

  /**
   * Updates an existing book by genre and ID
   * @param {string} genre - The book's genre/category
   * @param {number} id - The book ID
   * @param {UpdateBookDto} updateBookDto - Partial book data to update
   * @returns {Promise<Book>} The updated book
   */
  async update(genre: string, id: number, updateBookDto: UpdateBookDto) {
    return this.categoriesService.updateBook(genre, id, updateBookDto);
  }

  /**
   * Deletes a book by genre and ID
   * @param {string} genre - The book's genre/category
   * @param {number} id - The book ID
   * @returns {Promise<{message: string}>} Success message
   */
  async delete(genre: string, id: number) {
    return this.categoriesService.deleteBook(genre, id);
  }
}