import React, { useState, useEffect } from 'react';

// Backgrounds
import bgGuest from './img/bg_guest.png';
import libraryBg from './img/bg.png';
import recordsBg from './img/bg.png';
import editIcon from './img/edit.svg'; 
import deleteIcon from './img/delete.svg';

// Book images
import fiction from './img/book4.png';
import philosophy from './img/book3.png';
import encyclopedia from './img/encyc.png';
import literature from './img/book1.png';
import narrative from './img/narra.png';
import history from './img/book2.png';
import recordBook from './img/record.png';
import logo from './img/logo.png';

const availableImages = [fiction, philosophy, encyclopedia, literature];

const imageMap = {
  FICTIONS: fiction,
  PHILOSOPHY: philosophy,
  ENCYCLOPEDIA: encyclopedia,
  LITERATURE: literature,
  NARRATIVE: narrative,
  HISTORY: history,
};

const LibraryHome = () => {
  const [view, setView] = useState('landing');
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookCategories, setBookCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
  });
  const [editBook, setEditBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', author: '', description: '' });
  const [editErrors, setEditErrors] = useState({});
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState(''); 
  const [editCategory, setEditCategory] = useState(null); 
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryError, setEditCategoryError] = useState('');
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(null);
  const [visibleBooks, setVisibleBooks] = useState({});

  // Fetch categories and books on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        console.log('Fetched categories:', data); 
        setBookCategories(
          data.map((cat) => ({
            ...cat,
            image: imageMap[cat.genre.toUpperCase()] || availableImages[Math.floor(Math.random() * availableImages.length)],
            books: cat.books || [],
          }))
        );
        const initialVisible = data.reduce((acc, cat) => {
          acc[cat.genre] = 4;
          return acc;
        }, {});
        setVisibleBooks(initialVisible);
        if (data.length > 0) {
          setNewBook((prev) => ({ ...prev, genre: data[0].genre }));
        } else {
          setNewBook((prev) => ({ ...prev, genre: '' }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch books and categories from backend
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      const categories = [];
      data.forEach((book) => {
        const existingCategory = categories.find((cat) => cat.genre === book.genre);
        if (existingCategory) {
          existingCategory.books.push(book);
        } else {
          categories.push({ genre: book.genre, books: [book] });
        }
      });
      console.log('Fetched categories:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books');
      return [];
    }
  };

  useEffect(() => {
    fetchBooks().then((categories) => setBookCategories(categories));
  }, []);  

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError('Category name is required.');
      return;
    }
    const normalizedCategory = newCategory.toUpperCase().trim();
    if (bookCategories.some((cat) => cat.genre === normalizedCategory)) {
      setCategoryError('Category already exists.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre: normalizedCategory }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Unknown error';
        if (Array.isArray(errorData.message)) errorMessage = errorData.message.join(', ');
        throw new Error(`Failed to add category: ${errorMessage}`);
      }
      await fetchCategories();
      setNewCategory('');
      setCategoryError('');
      setShowAddCategoryModal(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryError(error.message);
    }
  };

  // Handle editing a category
  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) {
      setEditCategoryError('Category name is required.');
      return;
    }
    const normalizedCategory = editCategoryName.toUpperCase().trim();
    if (bookCategories.some((cat) => cat.genre === normalizedCategory && cat.genre !== editCategory.genre)) {
      setEditCategoryError('Category already exists.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/categories/${editCategory.genre}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre: normalizedCategory }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Unknown error';
        if (Array.isArray(errorData.message)) errorMessage = errorData.message.join(', ');
        throw new Error(`Failed to update category: ${errorMessage}`);
      }
      await fetchCategories();
      setEditCategory(null);
      setEditCategoryName('');
      setEditCategoryError('');
    } catch (error) {
      console.error('Error updating category:', error);
      setEditCategoryError(error.message);
    }
  };


  // Handle deleting a category
  const handleDeleteCategory = async (category) => {
    try {
      const response = await fetch(`http://localhost:3000/categories/${encodeURIComponent(category.genre)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Unknown error';
        if (Array.isArray(errorData.message)) errorMessage = errorData.message.join(', ');
        throw new Error(`Failed to delete category: ${errorMessage}`);
      }
      await fetchCategories();
      setShowDeleteCategoryModal(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`Failed to delete category: ${error.message}`);
    }
  };

  const handleDeleteBook = async (category, index) => {
    const book = category.books[index];
    try {
      const response = await fetch(`http://localhost:3000/books/${category.genre}/${book.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        let errorMessage = 'Unknown error';
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : typeof errorData.message === 'string'
            ? errorData.message
            : JSON.stringify(errorData.message);
        }
        throw new Error(`Failed to delete book: ${errorMessage}`);
      }
      const updatedCategories = await fetchBooks();
      setBookCategories(updatedCategories);
      setShowDeleteModal(null); 
    } catch (error) {
      console.error('Error deleting book:', error);
      alert(`Failed to delete book: ${error.message}`);
    }
  };

  // Handle adding a new book
  const handleAddBook = async () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.description.trim() || !newBook.genre.trim()) {
      alert('All fields, including category, are required.');
      return;
    }

  
  const categoryExists = bookCategories.some((cat) => cat.genre === newBook.genre);
    if (!categoryExists) {
      alert(`Category ${newBook.genre} does not exist. Please select a valid category.`);
      return;
    }
    try {
      console.log('Sending book data:', newBook); 
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData); 
        let errorMessage = 'Unknown error';
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : typeof errorData.message === 'string'
            ? errorData.message
            : JSON.stringify(errorData.message);
        }
        throw new Error(`Failed to add book: ${errorMessage}`);
      }
      const data = await response.json();
      const updated = bookCategories.map((cat) =>
        cat.genre === newBook.genre
          ? { ...cat, books: [...cat.books, data] }
          : cat
      );
      setBookCategories(updated);
      setShowAddModal(false);
      setNewBook({ title: '', author: '', description: '', genre: bookCategories[0]?.genre || '' });
    } catch (error) {
      console.error('Error adding book:', error);
      alert(error.message);
    }
  };

  // Handle editing a book
  const handleEditBook = async () => {
    const errors = {};
    if (!editForm.title.trim()) errors.title = 'Title is required.';
    if (!editForm.author.trim()) errors.author = 'Author is required.';
    if (!editForm.description.trim()) errors.description = 'Description is required.';

    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await fetch(
        `http://localhost:3000/books/${editBook.category.genre}/${editBook.category.books[editBook.index].id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        let errorMessage = 'Unknown error';
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : typeof errorData.message === 'string'
            ? errorData.message
            : JSON.stringify(errorData.message);
        }
        throw new Error(`Failed to update book: ${errorMessage}`);
      }
      const data = await response.json();
      const updated = bookCategories.map((cat) => {
        if (cat.genre !== editBook.category.genre) return cat;
        const updatedBooks = [...cat.books];
        updatedBooks[editBook.index] = data;
        return { ...cat, books: updatedBooks };
      });
      setBookCategories(updated);
      setEditBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
      alert(`Failed to update book: ${error.message}`);
    }
  };

  // Toggle See More/Less
  const toggleBooks = (genre) => {
    setVisibleBooks((prev) => ({
      ...prev,
      [genre]: prev[genre] === 4 ? Infinity : 4,
    }));
  };

  // Fetch categories and books on mount
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      console.log('Fetched categories:', data);
      const categories = data.map((cat) => ({
        ...cat,
        image: imageMap[cat.genre.toUpperCase()] || availableImages[Math.floor(Math.random() * availableImages.length)],
        books: cat.books || [],
      }));
      setBookCategories(categories);
      setVisibleBooks(categories.reduce((acc, cat) => ({ ...acc, [cat.genre]: 4 }), {}));
      if (categories.length > 0 && !newBook.genre) {
        setNewBook((prev) => ({ ...prev, genre: categories[0].genre }));
      }
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
      return [];
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-y-auto font-poppins">
      {/* Landing Page */}
      {view === 'landing' && (
        <div
          className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
          style={{ backgroundImage: `url(${bgGuest})` }}
        >
          <div className="relative inline-block text-center">
            <h1 className="text-[166px] font-bold leading-none">Library</h1>
            <span className="absolute top-0 right-0 text-[50px] tracking-widest">SJN</span>
          </div>
          <button
            className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transition"
            onClick={() => setView('library')}
          >
            MANAGE
          </button>
        </div>
      )}

      {/* Library Page */}
      {view === 'library' && (
        <div
          className={`min-h-screen w-full bg-cover bg-center relative text-white pb-20 ${
            selectedBook ? 'blur-sm' : ''
          }`}
          style={{
            backgroundImage: `url(${libraryBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Top bar */}
          <div className="sticky top-0 bg-opacity-70 backdrop-blur-sm px-6 py-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SJN Library Logo" className="w-[45px] h-auto" />
              <h2 className="text-white text-2xl font-bold tracking-wider">SJN LIBRARY</h2>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => setView('records')}
              >
                <img
                  src={recordBook}
                  alt="Record Book"
                  className="w-[45px] h-auto hover:scale-110 transition-transform"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  View Records
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">SJN LIBRARY</h1>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                Explore our collection of books across various genres. Click on any book to learn more about it.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mb-16 bg-brown bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 border border-white-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">{bookCategories.length}</div>
                  <div className="text-gray-300 text-sm">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {bookCategories.reduce((total, cat) => total + cat.books.length, 0)}
                  </div>
                  <div className="text-gray-300 text-sm">Total Books</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">
                    {bookCategories.reduce((total, cat) => total + new Set(cat.books.map(b => b.author)).size, 0)}
                  </div>
                  <div className="text-gray-300 text-sm">Unique Authors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-gray-300 text-sm">Available</div>
                </div>
              </div>
            </div>

            {/* Book Categories Grid */}
            <div className="space-y-16">
              {bookCategories.map((category, index) => (
                <div key={index} className="bg-brown bg-opacity-40 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white-700">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-white">{category.genre}</h3>
                    </div>
                    <span className="text-gray-300 text-sm bg-gray-800 px-3 py-1 rounded-full">
                      {category.books.length} books
                    </span>
                  </div>

                  {/* Books Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {category.books.slice(0, visibleBooks[category.genre] || 4).map((book, i) => (
                      <div
                        key={i}
                        className="bg-brown bg-opacity-10 backdrop-blur-sm rounded-xl p-6 cursor-pointer transform hover:scale-105 hover:bg-opacity-20 transition-all duration-300 border border-white-600 hover:border-gray-400 shadow-lg group"
                        onClick={() => setSelectedBook({ ...book, genre: category.genre })}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-32 h-40 mb-4 flex items-center justify-center">
                            <img
                              src={category.image}
                              alt={book.title}
                              className="w-full h-full object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                            />
                          </div>
                          <div className="w-full">
                            <p className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                              {book.title}
                            </p>
                            <p className="text-gray-300 text-xs italic mb-2 line-clamp-1">
                              {book.author}
                            </p>
                            <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                              {book.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* See More/Less Button */}
                  {category.books.length > 4 && (
                    <div className="flex justify-end mt-4">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                        onClick={() => toggleBooks(category.genre)}
                      >
                        {visibleBooks[category.genre] === 4 ? 'See More' : 'See Less'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Back Button at Bottom */}
          <div className="fixed bottom-6 left-6 z-10">
            <button
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2"
              onClick={() => setView('landing')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Book Description Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-brown-900 to-brown text-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white-700 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSelectedBook(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-white">{selectedBook.title}</h3>
              <p className="text-gray-300 italic mb-1">{selectedBook.author}</p>
              <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                {selectedBook.genre}
              </span>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6">
              <p className="text-gray-200 leading-relaxed">{selectedBook.description}</p>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedBook(null)}
              >
                Close
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                onClick={() => {
                  setSelectedBook(null);
                }}
              >
                Read Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Add New Book</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${!newBook.title && 'border-red-500'}`}
              />
              {!newBook.title && (
                <p className="text-red-500 text-xs">Title is required.</p>
              )}
              <input
                type="text"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${!newBook.author && 'border-red-500'}`}
              />
              {!newBook.author && (
                <p className="text-red-500 text-xs">Author is required.</p>
              )}
              <textarea
                placeholder="Description"
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${!newBook.description && 'border-red-500'}`}
              />
              {!newBook.description && (
                <p className="text-red-500 text-xs">Description is required.</p>
              )}
              {bookCategories.length > 0 ? (
                <select
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className={`w-full px-3 py-2 border rounded ${!newBook.genre && 'border-red-500'}`}
                >
                  <option value="" disabled>Select a category</option>
                  {bookCategories.map((cat) => (
                    <option key={cat.genre} value={cat.genre}>
                      {cat.genre}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500 text-xs">No categories available. Please add a category first.</p>
              )}
              {!newBook.genre && bookCategories.length > 0 && (
                <p className="text-red-500 text-xs">Category is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleAddBook}
                disabled={!newBook.title.trim() || !newBook.author.trim() || !newBook.description.trim() || !newBook.genre.trim() || bookCategories.length === 0}
              >
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`w-full px-3 py-2 border rounded ${!newCategory && 'border-red-500'}`}
              />
              {!newCategory && (
                <p className="text-red-500 text-xs">Category name is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Edit Book</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${editErrors.title ? 'border-red-500' : ''}`}
              />
              {editErrors.title && <p className="text-red-500 text-xs">{editErrors.title}</p>}

              <input
                type="text"
                placeholder="Author"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${editErrors.author ? 'border-red-500' : ''}`}
              />
              {editErrors.author && <p className="text-red-500 text-xs">{editErrors.author}</p>}

              <textarea
                placeholder="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded ${editErrors.description ? 'border-red-500' : ''}`}
              />
              {editErrors.description && <p className="text-red-500 text-xs">{editErrors.description}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditBook(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleEditBook}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records Page */}
      {view === 'records' && (
        <div
          className="w-full h-screen bg-cover bg-center relative text-white"
          style={{ backgroundImage: `url(${recordsBg})` }}
        >
          {/* Header bar */}
          <div className="absolute top-[3%] left-0 w-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="SJN Library Logo" className="w-10 h-auto" />
              <h2 className="text-white text-xl font-bold tracking-wide">SJN LIBRARY</h2>
            </div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
                onClick={() => setShowAddModal(true)}
              >
                + ADD BOOK
              </button>
              <button
                className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
                onClick={() => setShowAddCategoryModal(true)}
              >
                + ADD CATEGORY
              </button>
            </div>
          </div>

          {/* Table container */}
          <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 w-full max-w-5xl max-h-[700px] overflow-y-auto">
            <table className="w-full text-left bg-white text-black rounded overflow-hidden shadow-lg text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2">TITLE</th>
                  <th className="px-3 py-2">DESCRIPTION</th>
                  <th className="px-3 py-2">BOOK CATEGORY</th>
                  <th className="px-3 py-2">AUTHOR</th>
                  <th className="px-3 py-2">DATE PUBLISHED</th>
                  <th className="px-3 py-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {bookCategories.flatMap((category) =>
                  category.books.map((book, index) => (
                    <tr key={book.id} className="border-t">
                      <td className="px-3 py-2">{book.title}</td>
                      <td className="px-3 py-2">{book.description}</td>
                      <td className="px-3 py-2">{category.genre}</td>
                      <td className="px-3 py-2">{book.author}</td>
                      <td className="px-3 py-2">{book.datePublished || '2025-10-08'}</td>
                      <td className="px-3 py-2 flex gap-2 items-center">
                        <img
                          src={editIcon}
                          alt="Edit Book"
                          className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                          onClick={() => {
                            setEditBook({ category, index });
                            setEditForm({
                              title: book.title,
                              author: book.author,
                              description: book.description,
                            });
                            setEditErrors({});
                          }}
                        />
                        <img
                          src={deleteIcon}
                          alt="Delete Book"
                          className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                          onClick={() => setShowDeleteModal({ category, index })}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Return Button at Bottom */}
          <div className="absolute bottom-6 left-1/8 transform -translate-x-1/2">
            <button
              className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
              onClick={() => setView('library')}
            >
              ←
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
            <p className="text-black mb-4">
              Are you sure you want to delete the book "
              {showDeleteModal.category.books[showDeleteModal.index].title}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteBook(showDeleteModal.category, showDeleteModal.index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setCategoryError('');
                }}
                className={`w-full px-3 py-2 border rounded ${categoryError ? 'border-red-500' : ''}`}
              />
              {categoryError && <p className="text-red-500 text-xs">{categoryError}</p>}
              {/* Current Categories Section */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Current Categories</h4>
                {bookCategories.length > 0 ? (
                  <ul className="space-y-2">
                    {bookCategories.map((cat) => (
                      <li key={cat.genre} className="flex justify-between items-center">
                        <span>{cat.genre}</span>
                        <div className="flex gap-2">
                          <img
                            src={editIcon}
                            alt="Edit Category"
                            className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                            onClick={() => {
                              setEditCategory(cat);
                              setEditCategoryName(cat.genre);
                              setEditCategoryError('');
                            }}
                          />
                          <img
                            src={deleteIcon}
                            alt="Delete Category"
                            className="w-5 h-5 cursor-pointer hover:opacity-80 transition"
                            onClick={() => setShowDeleteCategoryModal(cat)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">You haven’t added any categories yet.</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategory('');
                  setCategoryError('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editCategory && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Category Name"
                value={editCategoryName}
                onChange={(e) => {
                  setEditCategoryName(e.target.value);
                  setEditCategoryError('');
                }}
                className={`w-full px-3 py-2 border rounded ${editCategoryError ? 'border-red-500' : ''}`}
              />
              {editCategoryError && <p className="text-red-500 text-xs">{editCategoryError}</p>}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setEditCategory(null);
                  setEditCategoryName('');
                  setEditCategoryError('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                onClick={handleEditCategory}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
            <p className="text-black mb-4">
              Are you sure you want to delete the category "{showDeleteCategoryModal.genre}"?
              {showDeleteCategoryModal.books.length > 0 &&
                ` This will also delete ${showDeleteCategoryModal.books.length} book(s).`}
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
                onClick={() => setShowDeleteCategoryModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteCategory(showDeleteCategoryModal)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryHome;