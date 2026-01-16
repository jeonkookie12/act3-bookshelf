import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateBookDto } from '../books/dto/create-book.dto';
import { UpdateBookDto } from '../books/dto/update-book.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Book } from '../book.entity';

/**
 * Categories service
 * Contains all business logic for category and book management operations
 * Handles CRUD operations for both categories and books
 */
@Injectable()
export class CategoriesService {
  constructor(
    // Inject the TypeORM repository for Category entity
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    // Inject the TypeORM repository for Book entity
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  /**
   * Retrieves all categories with their associated books
   * @returns {Promise<Category[]>} Array of categories with books
   */
  async findAll() {
    return this.categoryRepository.find({ relations: ['books'] });
  }

  /**
   * Creates a new category/genre
   * Normalizes genre name to uppercase and trims whitespace
   * @param {CreateCategoryDto} createCategoryDto - Category data to create
   * @returns {Promise<Category>} The newly created category
   * @throws {NotFoundException} If the category already exists
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const normalizedGenre = createCategoryDto.genre.toUpperCase().trim();
    const existing = await this.categoryRepository.findOne({ where: { genre: normalizedGenre } });
    if (existing) throw new NotFoundException(`Category ${normalizedGenre} already exists`);
    const category = this.categoryRepository.create({ genre: normalizedGenre });
    return this.categoryRepository.save(category);
  }

  /**
   * Finds a category by genre name
   * Normalizes genre name to uppercase and trims whitespace
   * @param {string} genre - The genre name
   * @returns {Promise<Category>} The category with the specified genre
   * @throws {NotFoundException} If the category is not found
   */
  async findOne(genre: string) {
    const normalizedGenre = genre.toUpperCase().trim();
    const category = await this.categoryRepository.findOne({
      where: { genre: normalizedGenre },
      relations: ['books'],
    });
    if (!category) throw new NotFoundException(`Category ${genre} not found`);
    return category;
  }

  /**
   * Adds a new book to a category
   * Sets the publication date to today's date
   * @param {CreateBookDto} createBookDto - Book data to create
   * @returns {Promise<Book>} The newly created book
   */
  async addBook(createBookDto: CreateBookDto) {
    const category = await this.findOne(createBookDto.genre);
    const book = this.bookRepository.create({
      title: createBookDto.title,
      author: createBookDto.author,
      description: createBookDto.description,
      genre: createBookDto.genre.toUpperCase(),
      datePublished: new Date().toISOString().split('T')[0], // Set to today's date
      category,
    });
    return this.bookRepository.save(book);
  }

  /**
   * Updates an existing book by genre and ID
   * @param {string} genre - The book's genre/category
   * @param {number} id - The book ID
   * @param {UpdateBookDto} updateBookDto - Partial book data to update
   * @returns {Promise<Book>} The updated book
   * @throws {NotFoundException} If the book is not found
   */
  async updateBook(genre: string, id: number, updateBookDto: UpdateBookDto) {
    const category = await this.findOne(genre);
    const book = await this.bookRepository.findOne({ where: { id, genre: genre.toUpperCase() } });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    // Update only provided fields, keep existing values for omitted fields
    Object.assign(book, {
      title: updateBookDto.title || book.title,
      author: updateBookDto.author || book.author,
      description: updateBookDto.description || book.description,
    });
    return this.bookRepository.save(book);
  }

  /**
   * Deletes a book by genre and ID
   * @param {string} genre - The book's genre/category
   * @param {number} id - The book ID
   * @returns {Promise<{message: string}>} Success message
   * @throws {NotFoundException} If the book is not found
   */
  async deleteBook(genre: string, id: number) {
    const category = await this.findOne(genre);
    const book = await this.bookRepository.findOne({ where: { id, genre: genre.toUpperCase() } });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    await this.bookRepository.delete(id);
    return { message: `Book with id ${id} deleted successfully` };
  }

  /**
   * Updates an existing category by genre name
   * Normalizes new genre name to uppercase and trims whitespace
   * @param {string} genre - The current genre name
   * @param {UpdateCategoryDto} updateCategoryDto - Category data to update
   * @returns {Promise<Category>} The updated category
   * @throws {NotFoundException} If the new genre name already exists
   */
  async update(genre: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(genre);
    const normalizedNewGenre = updateCategoryDto.genre.toUpperCase().trim();
    const existing = await this.categoryRepository.findOne({ where: { genre: normalizedNewGenre } });
    if (existing && existing.genre !== genre.toUpperCase()) {
      throw new NotFoundException(`Category ${normalizedNewGenre} already exists`);
    }
    category.genre = normalizedNewGenre;
    return this.categoryRepository.save(category);
  }

  /**
   * Deletes a category and all its associated books
   * @param {string} genre - The genre name
   * @returns {Promise<{message: string}>} Success message
   * @throws {InternalServerErrorException} If deletion fails
   */
  async delete(genre: string) {
    const normalizedGenre = genre.toUpperCase().trim();
    const category = await this.findOne(normalizedGenre); 
    try {
      await this.categoryRepository.delete({ genre: normalizedGenre });
      return { message: `Category ${genre} and associated books deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to delete category: ${error.message}`);
    }
  }
}