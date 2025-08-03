import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { bookAPI } from '../services/api';

const BookContext = createContext();

const initialState = {
  books: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  filters: {
    locale: 'en-US',
    seed: '42',
    averageLikes: 0,
    averageReviews: 0
  },
  viewMode: 'table', // 'table' or 'gallery'
  selectedBook: null,
  totalDisplayed: 0
};

const bookReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_BOOKS':
      return {
        ...state,
        books: action.payload.reset ? action.payload.books : [...state.books, ...action.payload.books],
        loading: false,
        error: null,
        hasMore: action.payload.books.length === 20, // If we got less than page size, no more data
        currentPage: action.payload.reset ? 0 : state.currentPage + 1,
        totalDisplayed: action.payload.totalDisplayed
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        books: [], // Reset books when filters change
        currentPage: 0,
        hasMore: true,
        totalDisplayed: 0
      };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    case 'SET_SELECTED_BOOK':
      return { ...state, selectedBook: action.payload };
    
    case 'RESET_BOOKS':
      return {
        ...state,
        books: [],
        currentPage: 0,
        hasMore: true,
        totalDisplayed: 0
      };
    
    default:
      return state;
  }
};

export const BookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  const loadBooks = useCallback(async (reset = false) => {
    if (state.loading) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const page = reset ? 0 : state.currentPage + 1;
      const response = await bookAPI.getBooks({
        page,
        pageSize: 20,
        ...state.filters
      });

      if (response.success) {
        dispatch({
          type: 'SET_BOOKS',
          payload: {
            books: response.data,
            reset,
            totalDisplayed: response.totalDisplayed
          }
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.loading, state.currentPage, state.filters]);

  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const setViewMode = useCallback((mode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const selectBook = useCallback(async (bookId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await bookAPI.getBookDetails(bookId, state.filters);
      
      if (response.success) {
        dispatch({ type: 'SET_SELECTED_BOOK', payload: response.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.filters]);

  const generateRandomSeed = useCallback(async () => {
    try {
      const response = await bookAPI.generateRandomSeed();
      if (response.success) {
        updateFilters({ seed: response.seed });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [updateFilters]);

  const exportToCSV = useCallback(async () => {
    try {
      const pages = Math.ceil(state.totalDisplayed / 20);
      const response = await bookAPI.exportCSV({
        pages,
        ...state.filters
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `books_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.totalDisplayed, state.filters]);

  const value = {
    ...state,
    loadBooks,
    updateFilters,
    setViewMode,
    selectBook,
    generateRandomSeed,
    exportToCSV
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

export default BookContext;