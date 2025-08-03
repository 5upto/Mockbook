import React from 'react';
import logo from './assets/logo.png';
import { BookProvider } from './contexts/BookContext';
import Controls from './components/Controls';
import InfiniteScrollContainer from './components/InfiniteScrollContainer';
import './App.css';

function App() {
  return (
    <BookProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={logo} alt="Mockbook Logo" className="w-12 h-12 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Mockbook</h1>
              </div>
              <div className="text-sm text-gray-500">
                Generate realistic fake book data for testing
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Controls />

          <InfiniteScrollContainer />
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>Mockbook - Generate realistic fake book data for testing purposes</p>
              <p className="mt-1">
                Built with React, Node.js, and MySQL |
                <span className="ml-1">Supports infinite scrolling and CSV export</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BookProvider>
  );
}

export default App;