# Act3 - Bookshelf Application

A full-stack Bookshelf management application with books and categories, built with NestJS backend and React frontend.

## 🚀 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Database ORM
- **RESTful API** - Standard HTTP methods

### Frontend
- **React** - UI library
- **Vite** - Fast build tool
- **CSS** - Custom styling with fonts

## 📁 Project Structure

```
Act3-Bookshelf/
├── backend/                    # NestJS REST API
│   ├── src/
│   │   ├── books/              # Books module (CRUD operations)
│   │   ├── categories/         # Categories module (CRUD operations)
│   │   ├── book.entity.ts      # Book entity model
│   │   ├── category.entity.ts  # Category entity model
│   │   └── main.ts             # Entry point
│   └── package.json
└── bookshelf_frontend/         # React application
    ├── src/
    │   ├── App.jsx             # Main component
    │   ├── font.css            # Custom fonts
    │   └── main.jsx            # Entry point
    └── package.json
```

## 🎯 Features

### Books Management
- ✅ Create new books
- ✅ View all books
- ✅ Update book details
- ✅ Delete books
- ✅ Filter books by category
- ✅ Search books by title/author

### Categories Management
- ✅ Create categories
- ✅ View all categories
- ✅ Update categories
- ✅ Delete categories
- ✅ Assign books to categories

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Database (MySQL/PostgreSQL/SQLite)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=3000
     DB_TYPE=mysql
     DB_HOST=localhost
     DB_PORT=3306
     DB_USERNAME=your_db_username
     DB_PASSWORD=your_db_password
     DB_DATABASE=bookshelf_db
     ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will run on `http://localhost:3000` (default)

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd bookshelf_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (default for Vite)

## 📝 API Endpoints

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## 📖 Book Entity

A typical book object includes:
- `id` - Unique identifier
- `title` - Book title
- `author` - Book author
- `description` - Book description
- `categoryId` - Associated category ID
- `isbn` - ISBN number
- `publishedDate` - Publication date
- `coverImage` - Cover image URL

## 🏷️ Category Entity

A typical category object includes:
- `id` - Unique identifier
- `name` - Category name
- `description` - Category description
- `books` - Associated books (relationship)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### End-to-End Tests
```bash
cd backend
npm run test:e2e
```

## 📚 Documentation

- Backend API documentation: [backend/BACKEND_DOCUMENTATION.md](backend/BACKEND_DOCUMENTATION.md)
- Backend README: [backend/README.md](backend/README.md)
- Frontend README: [bookshelf_frontend/README.md](bookshelf_frontend/README.md)

## 👨‍💻 Development

### Backend Architecture
The backend uses NestJS with the following structure:
- **Books Module** - Handles book CRUD operations
- **Categories Module** - Manages book categories
- **Entities** - Database models with TypeORM relationships
- **DTOs** - Data validation for requests
- **Services** - Business logic layer
- **Controllers** - HTTP request handlers

### Frontend Development
The frontend is built with React and features:
- Functional components with hooks
- Custom fonts and styling
- Responsive design
- API integration for book management
- Category filtering and search functionality

## 🎨 UI Features

- Custom typography with imported fonts
- Responsive grid/list views for books
- Category-based filtering
- Book detail views
- Add/Edit book forms
- Category management interface

## 🚢 Deployment

Refer to individual README files in backend and bookshelf_frontend directories for deployment instructions.

## 📄 License

This project is part of Laboratory Activities coursework.
