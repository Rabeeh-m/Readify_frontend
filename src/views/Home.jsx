import React from 'react';
import { Link } from 'react-router-dom';

function Books() {
  // Sample genres and books data with image URLs
  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'Fantasy'];
  const books = [
    { 
      id: 1, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      genre: 'Fiction', 
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      image: 'https://m.media-amazon.com/images/I/819wCzUTZWL._AC_UF1000,1000_QL80_.jpg'
    },
    { 
      id: 2, 
      title: 'Sapiens', 
      author: 'Yuval Noah Harari', 
      genre: 'Non-Fiction', 
      description: 'A brief history of humankind, from the Stone Age to the present.',
      image: 'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg'
    },
    { 
      id: 3, 
      title: 'The Da Vinci Code', 
      author: 'Dan Brown', 
      genre: 'Mystery', 
      description: 'A thrilling mystery involving secret societies and hidden codes.',
      image: 'https://m.media-amazon.com/images/I/71y4X5150dL._SY466_.jpg'
    },
    { 
      id: 4, 
      title: 'Dune', 
      author: 'Frank Herbert', 
      genre: 'Sci-Fi', 
      description: 'A science fiction epic set on the desert planet of Arrakis.',
      image: 'https://cdn.kobo.com/book-images/f972f36a-7c8f-48b1-bacb-3305eb4e0000/1200/1200/False/dune-1.jpg'
    },
    { 
      id: 5, 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      genre: 'Romance', 
      description: 'A classic romance novel exploring love and social class.',
      image: 'https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg'
    },
    { 
      id: 6, 
      title: 'The Hobbit', 
      author: 'J.R.R. Tolkien', 
      genre: 'Fantasy', 
      description: 'An adventure of Bilbo Baggins in a world of magic and dragons.',
      image: 'https://m.media-amazon.com/images/I/81mCE+uclxL._UF1000,1000_QL80_.jpg'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main role="main" className="flex-1" style={{ marginTop: 50 }}>
        {/* Hero Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#B17F59" }}>
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Our Book Collection
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto mb-6">
              Discover a wide range of books across various genres. Find your next great read today!
            </p>
            <p>
              <Link
                to="/books"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Browse All Books »
              </Link>
            </p>
          </div>
        </div>

        {/* Books Listing Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Genre Filters */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Filter by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <Link to={`/books/${book.id}`} >
                <div className="w-full aspect-[2/3] relative">
                  <img 
                    src={book.image} 
                    alt={`${book.title} cover`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">by {book.author}</p>
                    <p className="text-xs text-gray-500 mb-2">Genre: {book.genre}</p>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Books;