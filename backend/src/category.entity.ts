import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Book } from './book.entity';

/**
 * Category entity
 * Represents a book category/genre in the database
 * Each category can have multiple books
 */
@Entity()
export class Category {
  /**
   * Primary key - auto-generated unique identifier for each category
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Category/genre name
   * Unique constraint ensures no duplicate genres
   * Stored in uppercase for consistency
   */
  @Column({ unique: true })
  genre: string;

  /**
   * One-to-Many relationship with Book entity
   * One category can have many books
   */
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];

  /**
   * Timestamp when the category record was created
   * Automatically set by TypeORM
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the category record was last updated
   * Automatically updated by TypeORM
   */
  @UpdateDateColumn()
  updatedAt: Date;
}