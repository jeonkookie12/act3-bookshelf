# Act3-Bookshelf - Backend Documentation

## Overview
A book management API that organizes books by categories/genres. Allows users to manage categories and books within those categories. Books are always associated with a category.

## Architecture

### Technology Stack
- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Language**: TypeScript

### Project Structure
```
backend/src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module configuration
├── book.entity.ts         # Book entity definition
├── category.entity.ts     # Category entity definition
├── books/                 # Books feature module
│   ├── books.module.ts
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── dto/
│       ├── create-book.dto.ts
│       └── update-book.dto.ts
└── categories/            # Categories feature module
    ├── categories.module.ts
    ├── categories.controller.ts
    ├── categories.service.ts
    └── dto/
        ├── create-category.dto.ts
        └── update-category.dto.ts
```

## File-by-File Breakdown

### 1. `main.ts`
**Purpose**: Application bootstrap and server configuration

**Process**:
1. Creates NestJS application instance
2. Enables CORS for frontend communication
3. Starts HTTP server on port 3000

### 2. `app.module.ts`
**Purpose**: Root application module - configures all dependencies

**Process**:
1. Imports `ConfigModule` globally for environment variables
2. Configures TypeORM with async factory:
   - Reads database config from `.env`
   - Registers `Category` and `Book` entities explicitly
   - Enables `synchronize` option (auto-updates schema)
3. Imports `BooksModule` and `CategoriesModule`

**Key Features**:
- Explicit entity registration
- Database schema synchronization enabled

### 3. `category.entity.ts`
**Purpose**: Defines Category database table structure

**Properties**:
- `id`: Primary key
- `genre`: Category/genre name (unique)
- `books`: One-to-many relationship with Book entities

**Relationships**:
- One Category has many Books

### 4. `book.entity.ts`
**Purpose**: Defines Book database table structure

**Properties**:
- `id`: Primary key
- `title`: Book title
- `author`: Book author
- `category`: Many-to-one relationship with Category

**Relationships**:
- Many Books belong to one Category

### 5. `categories.module.ts`
**Purpose**: Categories module configuration

**Process**:
1. Imports `TypeOrmModule.forFeature([Category])` to register repository
2. Registers `CategoriesController` and `CategoriesService`
3. Exports `CategoriesService` for use in BooksModule

### 6. `categories.controller.ts`
**Purpose**: Handles HTTP requests for category management

**Endpoints**:
- `GET /categories` - Get all categories with books
- `POST /categories` - Create new category
- `PATCH /categories/:genre` - Update category by genre name
- `DELETE /categories/:genre` - Delete category (and all its books)

**Process**:
- Uses genre name as URL parameter (not ID)
- Routes requests to service methods

### 7. `categories.service.ts`
**Purpose**: Category business logic

**Methods**:

#### `findAll()`
- **Process**: 
  1. Queries all categories with their associated books
  2. Uses TypeORM relations to load books
- **Returns**: Array of categories with nested books

#### `create(createCategoryDto)`
- **Process**:
  1. Creates new Category entity
  2. Saves to database
- **Returns**: Created category

#### `update(genre, updateCategoryDto)`
- **Process**:
  1. Finds category by genre name
  2. Updates fields
  3. Saves changes
- **Returns**: Updated category

#### `delete(genre)`
- **Process**:
  1. Finds category by genre
  2. Deletes category (cascades to delete all books)
- **Returns**: Success message

#### `addBook(createBookDto)`
- **Process**:
  1. Finds or creates category by genre
  2. Creates book and associates with category
  3. Saves book
- **Returns**: Created book

#### `updateBook(genre, id, updateBookDto)`
- **Process**:
  1. Finds category by genre
  2. Finds book within that category
  3. Updates book fields
  4. Saves changes
- **Returns**: Updated book

#### `deleteBook(genre, id)`
- **Process**:
  1. Finds category by genre
  2. Finds book within that category
  3. Deletes book
- **Returns**: Success message

### 8. `books.module.ts`
**Purpose**: Books module configuration

**Process**:
1. Imports `CategoriesModule` to access CategoriesService
2. Registers `BooksController` and `BooksService`
3. Note: BooksService delegates to CategoriesService

### 9. `books.controller.ts`
**Purpose**: Handles HTTP requests for book management

**Endpoints**:
- `GET /books` - Get all books (flattened with genre)
- `POST /books` - Create new book in category
- `PATCH /books/:genre/:id` - Update book by genre and ID
- `DELETE /books/:genre/:id` - Delete book by genre and ID

**Process**:
- `GET /books` flattens category structure to return books with genre field
- Uses genre and ID as URL parameters

### 10. `books.service.ts`
**Purpose**: Book business logic (delegates to CategoriesService)

**Methods**:
- All methods delegate to corresponding CategoriesService methods
- Provides abstraction layer for book operations

## Data Flow

### Creating a Category
```
Client Request (POST /categories)
    ↓
CategoriesController.create()
    ↓
CategoriesService.create()
    ↓
Category Repository.save()
    ↓
MySQL Database
    ↓
Response (Category object)
```

### Creating a Book
```
Client Request (POST /books)
    ↓
BooksController.create()
    ↓
BooksService.create()
    ↓
CategoriesService.addBook()
    ↓
Find/Create Category
    ↓
Create Book with Category relationship
    ↓
Save to Database
    ↓
Response (Book object)
```

### Getting All Books
```
Client Request (GET /books)
    ↓
BooksController.findAll()
    ↓
BooksService.findAll()
    ↓
CategoriesService.findAll()
    ↓
Query Categories with Books (relations)
    ↓
Flatten structure (add genre to each book)
    ↓
Response (Array of books with genre)
```

## Database Schema

### Categories Table
```sql
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    genre VARCHAR(255) UNIQUE NOT NULL
);
```

### Books Table
```sql
CREATE TABLE book (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
```

## Environment Variables

Required in `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=bookshelf
DATABASE_SYNCHRONIZE=true
```

## Key Design Patterns

1. **Delegation Pattern**: BooksService delegates to CategoriesService
2. **Repository Pattern**: TypeORM repositories handle database operations
3. **DTO Pattern**: Data Transfer Objects validate and structure input
4. **Entity Relationships**: One-to-many relationship between Category and Book

## Error Handling

- **404 Not Found**: Category or book doesn't exist
- **400 Bad Request**: Invalid input data
- **500 Internal Server Error**: Database errors

## Important Notes

1. **Cascade Delete**: Deleting a category deletes all its books
2. **Genre as Identifier**: Categories are identified by genre name, not ID
3. **Book Identification**: Books require both genre and ID for operations
4. **Schema Synchronization**: Database schema auto-updates (development only)

## Testing Recommendations

1. Test category CRUD operations
2. Test book CRUD operations
3. Test cascade delete (delete category, verify books deleted)
4. Test book operations with invalid genre
5. Test duplicate genre creation (should fail)
6. Verify relationships are properly loaded


