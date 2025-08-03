import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import BookDetails from './BookDetails';

const BookCard = ({ book, index, onSelect, isSelected }) => {
  const patterns = [
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600'
  ];

  const pattern = patterns[book.cover?.pattern || 0];

  return (
    <div
      onClick={() => onSelect(book, index)}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
    >
      {/* Book Cover */}
      <div
        className={`h-48 ${pattern} flex flex-col justify-between p-4 text-white relative overflow-hidden`}
        style={{ backgroundColor: book.cover?.backgroundColor }}
      >
        <div className="absolute inset-0 opacity-10">
          {book.cover?.pattern === 0 && (
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
            }} />
          )}
          {book.cover?.pattern === 1 && (
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`
            }} />
          )}
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-3">
            {book.title}
          </h3>
        </div>

        <div className="relative z-10">
          <p className="text-sm opacity-90 line-clamp-2">
            by {book.authors.join(', ')}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">#{book.index}</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {book.likes}
            </span>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {book.reviews?.length || 0}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2 truncate">
          {book.publisher}
        </p>

        <p className="text-xs text-gray-400 font-mono">
          {book.isbn}
        </p>
      </div>
    </div>
  );
};

const BookGallery = () => {
  const { books, selectBook } = useBooks();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBookData, setSelectedBookData] = useState(null);

  const handleCardSelect = async (book, index) => {
    if (selectedCard === index) {
      setSelectedCard(null);
      setSelectedBookData(null);
    } else {
      setSelectedCard(index);
      const bookId = `${Math.floor(index / 20)}-${index % 20}`;
      await selectBook(bookId);
      setSelectedBookData(book);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <BookCard
            key={`${book.index}-${book.isbn}`}
            book={book}
            index={index}
            onSelect={handleCardSelect}
            isSelected={selectedCard === index}
          />
        ))}
      </div>

      {/* Expanded Book Details */}
      {selectedCard !== null && selectedBookData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Book Details</h2>
            <button
              onClick={() => {
                setSelectedCard(null);
                setSelectedBookData(null);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <BookDetails book={selectedBookData} />
        </div>
      )}

      {books.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No books found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your filters or check your connection
          </div>
        </div>
      )}
    </div>
  );
};

export default BookGallery;