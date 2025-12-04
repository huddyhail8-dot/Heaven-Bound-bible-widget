
import React, { useState, useEffect, useRef } from 'react';
import { VerseCategory } from '../types';

interface ControlsProps {
  onNewVerse: () => void;
  onCategoryChange: (category: VerseCategory | 'all') => void;
  onSearch: (query: string) => void;
  currentCategory: VerseCategory | 'all';
  categories: VerseCategory[];
}

const Controls: React.FC<ControlsProps> = ({
  onNewVerse,
  onCategoryChange,
  onSearch,
  currentCategory,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = window.setTimeout(() => {
      onSearch(searchQuery);
    }, 500); // Debounce search input
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, onSearch]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value as VerseCategory | 'all');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-lightCard dark:bg-darkCard rounded-lg shadow-md mb-6 transition-colors duration-300">
      <button
        onClick={onNewVerse}
        className="w-full md:w-auto px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-lg"
      >
        New Verse
      </button>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="block w-full sm:w-48 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 text-base"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="block w-full sm:w-64 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 text-base"
        />
      </div>
    </div>
  );
};

export default Controls;
