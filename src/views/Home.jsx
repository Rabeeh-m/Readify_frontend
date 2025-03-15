import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios from '../utils/useAxios';

function Home() {
  const axios = useAxios();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books/');
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        setLoading(false);
        console.error('Error fetching books:', err);
      }
    };
    fetchBooks();
  }, [axios]);

  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-xl font-medium animate-pulse">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-xl font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main role="main" className="flex-1">
        {/* Hero Section */}
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Books background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto text-center mt-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Read, Reflect and Redefine Yourself.
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
              Dive into a world of stories with our curated collection of books across all genres.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Explore Our Collection</h2>
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            />
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Link to={`/books/${book.id}`}>
                    <div className="w-full aspect-[2/3] relative">
                      <img
                        src={`http://127.0.0.1:8000${book.cover_image}`}
                        alt={`${book.title} cover`}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/200x300?text=No+Image')}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1 line-clamp-1">by {book.authors}</p>
                      <p className="text-xs text-gray-500">Genre: {book.genre}</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                No books match your search.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;