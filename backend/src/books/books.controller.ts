import { Controller, Post, Body, Patch, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { BooksService } from './books.service'; 
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

/**
 * Books controller
 * Handles all HTTP requests related to book management
 * All endpoints are prefixed with '/books'
 */
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * GET /books
   * Retrieves all books from all categories
   * Flattens the category structure and includes genre with each book
   * @returns {Promise<any[]>} Array of all books with their genres
   */
  @Get()
  async findAll() {
    const categories = await this.booksService.findAll();
    // Flatten categories and add genre to each book
    return categories.flatMap((cat) => cat.books.map((book) => ({ ...book, genre: cat.genre })));
  }

  /**
   * POST /books
   * Creates a new book in the specified category/genre
   * @param {CreateBookDto} createBookDto - Book data from the request body
   * @returns {Promise<Book>} The newly created book
   */
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  /**
   * PATCH /books/:genre/:id
   * Updates an existing book by genre and ID
   * @param {string} genre - The book's genre/category from the URL parameter
   * @param {number} id - The book ID from the URL parameter (parsed as integer)
   * @param {UpdateBookDto} updateBookDto - Partial book data to update
   * @returns {Promise<Book>} The updated book
   */
  @Patch(':genre/:id')
  async update(
    @Param('genre') genre: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(genre, id, updateBookDto);
  }

  /**
   * DELETE /books/:genre/:id
   * Deletes a book by genre and ID
   * @param {string} genre - The book's genre/category from the URL parameter
   * @param {number} id - The book ID from the URL parameter (parsed as integer)
   * @returns {Promise<{message: string}>} Success message
   */
  @Delete(':genre/:id')
  async delete(@Param('genre') genre: string, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.delete(genre, id);
  }
}