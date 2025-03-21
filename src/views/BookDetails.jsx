
// src/views/BookDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import Swal from 'sweetalert2';
import { Document, Page, pdfjs } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const BookDetails = () => {
  const { bookId } = useParams();
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [readingLists, setReadingLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');

  const isDevelopment = import.meta.env.MODE === 'development'
  const BaseUrl = isDevelopment ? import.meta.env.VITE_LOCAL_BASEURL : import.meta.env.VITE_DEPLOY_BASEURL;

  useEffect(() => {
    fetchBook();
    if (user) fetchReadingLists();
  }, [bookId, user]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`/books/${bookId}/`);
      setBook(response.data);
      console.log('Book data:', response.data);
      console.log('PDF URL:', `${BaseUrl}${response.data.book_file}`);
    } catch (error) {
      console.error('Error fetching book:', error);
      Swal.fire({ 
        title: 'Error loading book', 
        icon: 'error', 
        toast: true, 
        timer: 6000, 
        position: 'top-right' 
      });
      navigate('/books');
    }
  };

  const fetchReadingLists = async () => {
    try {
      const response = await axios.get('/reading-lists/');
      setReadingLists(response.data);
    } catch (error) {
      console.error('Error fetching reading lists:', error);
      Swal.fire({ 
        title: 'Error loading reading lists', 
        icon: 'error', 
        toast: true, 
        timer: 6000, 
        position: 'top-right' 
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log('PDF loaded with', numPages, 'pages');
  };

  const onDocumentLoadError = (error) => {
    console.error('Failed to load PDF:', error);
  };

  const handleAddToList = async () => {
    if (!selectedList) {
      Swal.fire({ 
        title: 'Please select a reading list', 
        icon: 'warning', 
        toast: true, 
        timer: 3000, 
        position: 'top-right' 
      });
      return;
    }
    try {
      await axios.post(`/reading-lists/${selectedList}/items/`, { book: bookId });
      Swal.fire({ 
        title: 'Book added to reading list', 
        icon: 'success', 
        toast: true, 
        timer: 3000, 
        position: 'top-right' 
      });
      setSelectedList(''); // Reset dropdown after adding
    } catch (error) {
      console.error('Error adding book to list:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add book to list';
      if (errorMessage === 'This book is already in the reading list') {
        Swal.fire({ 
          title: 'Book is already in this reading list', 
          icon: 'info', 
          toast: true, 
          timer: 3000, 
          position: 'top-right' 
        });
      } else {
        Swal.fire({ 
          title: `Error: ${errorMessage}`, 
          icon: 'error', 
          toast: true, 
          timer: 6000, 
          position: 'top-right' 
        });
      }
    }
  };

  if (!book) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* PDF Viewer */}
        <div className="lg:w-2/3 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{book.title}</h2>
          {book.book_file ? (
            <div className="flex-1 overflow-auto max-h-[60vh] sm:max-h-[70vh]">
              <Document
                file={`${BaseUrl}${book.book_file}`}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex justify-center"
              >
                <Page pageNumber={pageNumber} scale={0.8} />
              </Document>
              <div className="flex justify-between mt-4 sticky bottom-0 bg-white p-2 border-t">
                <button
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                >
                  Previous
                </button>
                <p className="text-gray-600 text-sm sm:text-base">
                  Page {pageNumber} of {numPages || '...'}
                </p>
                <button
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No PDF available for this book.</p>
          )}
        </div>

        {/* Details */}
        <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Book Details</h3>
          {book.cover_image && (
            <img
              src={`${BaseUrl}${book.cover_image}`}
              alt={book.title}
              className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
            />
          )}
          <p className="text-gray-600 text-sm sm:text-base"><strong>Title:</strong> {book.title}</p>
          <p className="text-gray-600 text-sm sm:text-base"><strong>Authors:</strong> {book.authors}</p>
          <p className="text-gray-600 text-sm sm:text-base"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-gray-600 text-sm sm:text-base">
            <strong>Published:</strong> {new Date(book.publication_date).toLocaleDateString()}
          </p>
          {book.description && (
            <p className="text-gray-600 text-sm sm:text-base mt-2 overflow-auto max-h-40 sm:max-h-48">
              <strong>Description:</strong> {book.description}
            </p>
          )}

          {/* Add to Reading List */}
          
            <div className="mt-4">
              <label htmlFor="readingList" className="block text-sm font-medium text-gray-700">
                Add to Reading List
              </label>
              <div className="flex gap-2 mt-1">
                <select
                  id="readingList"
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select a list</option>
                  {readingLists.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddToList}
                  className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm sm:text-base"
                >
                  Add
                </button>
              </div>
            </div>
         

          <button
            onClick={() => navigate('/books')}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
          >
            Back to Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;