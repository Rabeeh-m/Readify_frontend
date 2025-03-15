
// src/views/ReadingLists.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ReadingLists = () => {
  const axios = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [readingLists, setReadingLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    if (user) {
      fetchReadingLists();
    }
  }, [user]);

  const fetchReadingLists = async () => {
    try {
      const response = await axios.get('/reading-lists/');
      setReadingLists(response.data);
    } catch (error) {
      console.error('Error fetching reading lists:', error);
      Swal.fire({ title: 'Error loading reading lists', icon: 'error', toast: true, timer: 6000, position: 'top-right' });
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/reading-lists/', { name: newListName });
      setReadingLists([...readingLists, response.data]);
      setNewListName('');
      Swal.fire({ title: 'Reading List Created', icon: 'success', toast: true, timer: 3000, position: 'top-right' });
    } catch (error) {
      Swal.fire({ title: 'Error creating list', icon: 'error', toast: true, timer: 6000, position: 'top-right' });
    }
  };

  const handleDeleteList = async (listId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the reading list and all its items!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/reading-lists/${listId}/`);
        setReadingLists(readingLists.filter(list => list.id !== listId));
        Swal.fire({ title: 'Reading List Deleted', icon: 'success', toast: true, timer: 3000, position: 'top-right' });
      } catch (error) {
        Swal.fire({ title: 'Error deleting list', icon: 'error', toast: true, timer: 6000, position: 'top-right' });
      }
    }
  };

  const handleRemoveItem = async (listId, itemId) => {
    const result = await Swal.fire({
      title: 'Remove book?',
      text: 'This will remove the book from your reading list.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`/reading-lists/${listId}/items/${itemId}/`);
        setReadingLists(readingLists.map(list => 
          list.id === listId ? { ...list, items: list.items.filter(item => item.id !== itemId) } : list
        ));
        Swal.fire({ title: 'Book Removed', icon: 'success', toast: true, timer: 3000, position: 'top-right' });
      } catch (error) {
        console.error('Error removing item:', error);
        Swal.fire({ title: 'Error removing book', icon: 'error', toast: true, timer: 6000, position: 'top-right' });
      }
    }
  };

  const handleDragEnd = async (result, listId) => {
    const { source, destination } = result;

    if (!destination || (source.index === destination.index)) {
      return;
    }

    const updatedLists = readingLists.map(list => {
      if (list.id === listId) {
        const items = Array.from(list.items);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        const reorderedItems = items.map((item, index) => ({
          ...item,
          order: index
        }));

        return { ...list, items: reorderedItems };
      }
      return list;
    });

    setReadingLists(updatedLists);

    try {
      const listToUpdate = updatedLists.find(list => list.id === listId);
      const orderData = listToUpdate.items.map(item => ({
        id: item.id,
        order: item.order
      }));
      await axios.put(`/reading-lists/${listId}/`, {
        name: listToUpdate.name,
        items: orderData
      });
      Swal.fire({ title: 'Order Updated', icon: 'success', toast: true, timer: 2000, position: 'top-right' });
    } catch (error) {
      console.error('Error updating order:', error);
      Swal.fire({ title: 'Error updating order', icon: 'error', toast: true, timer: 6000, position: 'top-right' });
      fetchReadingLists();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Please log in to manage your reading lists.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Reading Lists</h2>

        <form onSubmit={handleCreateList} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter reading list name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create List
          </button>
        </form>

        {readingLists.length > 0 ? (
          readingLists.map(list => (
            <div key={list.id} className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{list.name}</h3>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Delete List
                </button>
              </div>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, list.id)}>
                <Droppable droppableId={`list-${list.id}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2" // Changed to vertical spacing
                    >
                      {list.items.length > 0 ? (
                        list.items.map((item, index) => (
                          <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md relative group cursor-move hover:bg-gray-100 transition duration-200"
                              >
                                <img
                                  src={`http://127.0.0.1:8000${item.book_details.cover_image}`}
                                  alt={item.book_details.title}
                                  className="w-12 h-16 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                  <p className="text-gray-800 font-medium">{item.book_details.title}</p>
                                  <p className="text-gray-600 text-sm">Genre: {item.book_details.genre}</p>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(list.id, item.id)}
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-gray-600">No books in this list yet.</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">You haven’t created any reading lists yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReadingLists;