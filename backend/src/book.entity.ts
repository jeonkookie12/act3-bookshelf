import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

/**
 * Book entity
 * Represents a book in the database
 * Each book belongs to a category/genre
 */
@Entity()
export class Book {
  /**
   * Primary key - auto-generated unique identifier for each book
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Book title
   */
  @Column()
  title: string;

  /**
   * Book author
   */
  @Column()
  author: string;

  /**
   * Book description
   */
  @Column()
  description: string;

  /**
   * Book genre/category name
   * Stored in uppercase for consistency
   */
  @Column()
  genre: string;

  /**
   * Date when the book was published
   * Stored as string in ISO date format (YYYY-MM-DD)
   */
  @Column()
  datePublished: string;

  /**
   * Foreign key reference to the category this book belongs to
   * Maps to the 'categoryId' column in the database
   */
  @Column({ name: 'categoryId' }) 
  categoryId: number;

  /**
   * Many-to-One relationship with Category entity
   * Many books can belong to one category
   */
  @ManyToOne(() => Category, (category) => category.books)
  category: Category;

  /**
   * Timestamp when the book record was created
   * Automatically set by TypeORM
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the book record was last updated
   * Automatically updated by TypeORM
   */
  @UpdateDateColumn()
  updatedAt: Date;
}