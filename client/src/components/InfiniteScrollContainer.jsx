import React, { useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useBooks } from '../contexts/BookContext';
import BookTable from './BookTable';
import BookGallery from './BookGallery';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading more books...</span>
  </div>
);

const EndMessage = () => (
  <div className="text-center py-8">
    <span className="text-2xl mb-2 block">📚</span>
    <p className="text-gray-500 font-medium">You've reached the end!</p>
    <p className="text-sm text-gray-400">No more books to display</p>
  </div>
);

const InfiniteScrollContainer = () => {
  const { 
    books, 
    loading, 
    hasMore, 
    loadBooks, 
    viewMode, 
    filters, 
    error 
  } = useBooks();

  useEffect(() => {
    loadBooks(true); 
  }, [filters.locale, filters.seed, filters.averageLikes, filters.averageReviews]);

  const fetchMoreData = useCallback(() => {
    if (!loading && hasMore) {
      loadBooks(false);
    }
  }, [loading, hasMore, loadBooks]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <span className="text-4xl mb-2 block">⚠️</span>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Books</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadBooks(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0 && loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Loading books...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={books.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        endMessage={<EndMessage />}
        scrollThreshold={0.9}
        style={{ overflow: 'visible' }}
      >
        {viewMode === 'table' ? <BookTable /> : <BookGallery />}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollContainer;