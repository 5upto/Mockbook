import React, { useState, useEffect } from 'react';
import { useBooks } from '../contexts/BookContext';

const Controls = () => {
  const { 
    filters, 
    updateFilters, 
    generateRandomSeed, 
    exportToCSV, 
    viewMode, 
    setViewMode,
    totalDisplayed
  } = useBooks();
  
  const [localFilters, setLocalFilters] = useState(filters);
  const [averageReviewsInput, setAverageReviewsInput] = useState(String(filters.averageReviews ?? '0'));


  useEffect(() => {
    setLocalFilters(filters);
    setAverageReviewsInput(String(filters.averageReviews ?? '0'));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleRandomSeed = async () => {
    await generateRandomSeed();
  };

  const localeOptions = [
    { value: 'en-US', label: 'English (USA)' },
    { value: 'de-DE', label: 'German (Germany)' },
    { value: 'fr-FR', label: 'French (France)' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language & Region
          </label>
          <select
            value={localFilters.locale}
            onChange={(e) => handleFilterChange('locale', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            {localeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seed Value
          </label>
          <div className="flex">
            <input
              type="text"
              value={localFilters.seed}
              onChange={(e) => handleFilterChange('seed', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter seed"
            />
            <button
              onClick={handleRandomSeed}
              className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              title="Generate random seed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Likes: {localFilters.averageLikes}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={localFilters.averageLikes}
            onChange={(e) => handleFilterChange('averageLikes', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Reviews
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={averageReviewsInput}
            onChange={(e) => {
              let input = e.target.value;
              // Remove leading zero if not decimal
              if (input.length > 1 && input[0] === '0' && input[1] !== '.') {
                input = input.replace(/^0+/, '');
              }
              // Prevent negative or invalid input
              if (/^-/.test(input)) return;
              setAverageReviewsInput(input);
              // Only update filters if input is a valid number
              if (input !== '' && !isNaN(Number(input))) {
                handleFilterChange('averageReviews', parseFloat(input));
              }
            }}
            onBlur={() => {
              // If input is empty on blur, reset to 0
              if (averageReviewsInput === '' || isNaN(Number(averageReviewsInput))) {
                setAverageReviewsInput('0');
                handleFilterChange('averageReviews', 0);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Displaying {totalDisplayed} books
          </span>
          
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </div>
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-white-600 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Table</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'gallery'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-white-600 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Gallery</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;