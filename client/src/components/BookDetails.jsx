import React from 'react';

const BookDetails = ({ book }) => {
  if (!book) return null;

  const patterns = [
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600'
  ];

  const pattern = patterns[book.cover?.pattern || 0];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div
          className={`${pattern} rounded-lg p-6 text-white h-80 flex flex-col justify-between relative overflow-hidden`}
          style={{ backgroundColor: book.cover?.backgroundColor }}
        >
          <div className="absolute inset-0 opacity-10">
            {book.cover?.pattern === 0 && (
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
              }} />
            )}
            {book.cover?.pattern === 1 && (
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`
              }} />
            )}
            {book.cover?.pattern === 2 && (
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpolygon points='15,0 30,15 15,30 0,15'/%3E%3C/g%3E%3C/svg%3E")`
              }} />
            )}
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl font-bold leading-tight mb-4">
              {book.title}
            </h1>
          </div>

          <div className="relative z-10">
            <p className="text-lg opacity-90 mb-2">
              by {book.authors.join(', ')}
            </p>
            <p className="text-sm opacity-75">
              {book.publisher}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Book Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Index:</span>
              <p className="text-gray-900">#{book.index}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">ISBN:</span>
              <p className="text-gray-900 font-mono text-sm">{book.isbn}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Authors:</span>
              <p className="text-gray-900">{book.authors.join(', ')}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Publisher:</span>
              <p className="text-gray-900">{book.publisher}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-pink-50 rounded-lg p-4 flex-1">
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-600 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-2xl font-bold text-pink-600">{book.likes}</p>
                <p className="text-sm text-pink-500">Likes</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 flex-1">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-blue-400 align-middle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="ml-3">
                <p className="text-2xl font-bold text-blue-600">{book.reviews?.length || 0}</p>
                <p className="text-sm text-blue-500"><span className="inline-flex items-center">Reviews</span></p>
              </div>
            </div>
          </div>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Reviews ({book.reviews.length})
            </h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {book.reviews.map((review, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm text-gray-500">({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!book.reviews || book.reviews.length === 0) && (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to review this book!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;