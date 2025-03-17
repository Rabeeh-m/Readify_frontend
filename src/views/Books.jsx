// src/views/Books.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Books = () => {
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    genre: '',
    publication_date: '',
    description: '',
    book_file: null,
    cover_image: null
  });
  const [isAdding, setIsAdding] = useState(false);

  const BaseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_BASEURL : import.meta.env.VITE_DEPLOY_BASEURL;

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/my-books/');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      Swal.fire({ 
        title: 'Error loading books', 
        icon: 'error', 
        toast: true, 
        timer: 6000, 
        position: 'top-right' 
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('authors', formData.authors);
      data.append('genre', formData.genre);
      data.append('publication_date', formData.publication_date);
      data.append('description', formData.description || '');
      if (formData.book_file) data.append('book_file', formData.book_file);
      if (formData.cover_image) data.append('cover_image', formData.cover_image);

      const response = await axios.post('/books/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBooks([...books, response.data]);
      setFormData({ 
        title: '', 
        authors: '', 
        genre: '', 
        publication_date: '', 
        description: '', 
        book_file: null, 
        cover_image: null 
      });
      setIsAdding(false);
      Swal.fire({ 
        title: 'Book Added', 
        icon: 'success', 
        toast: true, 
        timer: 3000, 
        position: 'top-right' 
      });
    } catch (error) {
      console.error('Error adding book:', error.response?.data || error.message);
      Swal.fire({ 
        title: `Error: ${error.response?.data?.detail || 'Failed to add book'}`, 
        icon: 'error', 
        toast: true, 
        timer: 6000, 
        position: 'top-right' 
      });
    }
  };

  const handleDelete = async (bookId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.delete(`/books/${bookId}/delete/`);
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Delete failed: ${error.response?.data?.error || 'Server error'}`
          );
        }
      },
    });

    if (result.isConfirmed) {
      setBooks(books.filter(book => book.id !== bookId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Book has been removed.',
        icon: 'success',
        toast: true,
        timer: 3000,
        position: 'top-right'
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Please log in to view your books.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Book Collection</h2>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isAdding ? 'Cancel' : 'Add New Book'}
        </button>

        {isAdding && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="authors" className="block text-sm font-medium text-gray-700">Authors</label>
                <input 
                  type="text" 
                  id="authors" 
                  name="authors" 
                  value={formData.authors} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g., John Doe, Jane Smith" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                <input 
                  type="text" 
                  id="genre" 
                  name="genre" 
                  value={formData.genre} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="publication_date" className="block text-sm font-medium text-gray-700">Publication Date</label>
                <input 
                  type="date" 
                  id="publication_date" 
                  name="publication_date" 
                  value={formData.publication_date} 
                  onChange={handleInputChange} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                rows="3" 
              />
            </div>
            <div className="mt-4">
              <label htmlFor="book_file" className="block text-sm font-medium text-gray-700">PDF File</label>
              <input 
                type="file" 
                id="book_file" 
                name="book_file" 
                onChange={handleFileChange} 
                accept="application/pdf" 
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
            <div className="mt-4">
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Cover Image</label>
              <input 
                type="file" 
                id="cover_image" 
                name="cover_image" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              />
            </div>
            <button 
              type="submit" 
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Add Book
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.length > 0 ? (
            books.map(book => (
              <div 
                key={book.id} 
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer relative group"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {book.cover_image && (
                  <img 
                    src={`${BaseUrl}${book.cover_image}`} 
                    alt={book.title} 
                    className="w-20 h-28 object-cover rounded-md" 
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600"><strong>Authors:</strong> {book.authors}</p>
                  <p className="text-gray-600"><strong>Genre:</strong> {book.genre}</p>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(book.id); 
                  }} 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">You haven’t uploaded any books yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;