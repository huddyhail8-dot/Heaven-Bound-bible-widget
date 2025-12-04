
import React, { useState, useEffect, useCallback } from 'react';
import VerseDisplay from './components/VerseDisplay';
import Controls from './components/Controls';
import BibleWidget from './components/BibleWidget';
import DarkModeToggle from './components/DarkModeToggle';
import { Verse, VerseCategory, WidgetPosition } from './types';
import {
  getRandomVerse,
  getVersesByCategory,
  searchVerses,
  getVerses,
} from './services/bibleService';

const App: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [filteredVerses, setFilteredVerses] = useState<Verse[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [widgetMinimized, setWidgetMinimized] = useState<boolean>(() => {
    const savedMinimized = localStorage.getItem('widgetMinimized');
    return savedMinimized ? JSON.parse(savedMinimized) : false;
  });
  const [widgetPosition, setWidgetPosition] = useState<WidgetPosition>(() => {
    const savedPosition = localStorage.getItem('widgetPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: window.innerWidth - 300 - 16, y: window.innerHeight - 200 - 16 };
  });
  const [currentCategory, setCurrentCategory] = useState<VerseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableCategories = Object.values(VerseCategory);

  // Initialize verses and apply dark mode class
  useEffect(() => {
    const initialVerses = getVerses();
    setFilteredVerses(initialVerses);
    setCurrentVerse(getRandomVerse());

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist dark mode state
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Persist widget state
  useEffect(() => {
    localStorage.setItem('widgetMinimized', JSON.stringify(widgetMinimized));
  }, [widgetMinimized]);

  useEffect(() => {
    localStorage.setItem('widgetPosition', JSON.stringify(widgetPosition));
  }, [widgetPosition]);

  const fetchRandomVerse = useCallback(() => {
    if (filteredVerses.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredVerses.length);
      setCurrentVerse(filteredVerses[randomIndex]);
    } else {
      setCurrentVerse(null);
    }
  }, [filteredVerses]);

  const handleCategoryChange = useCallback((category: VerseCategory | 'all') => {
    setCurrentCategory(category);
    setSearchQuery(''); // Clear search when category changes
    const verses = getVersesByCategory(category);
    setFilteredVerses(verses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentVerse(verses.length > 0 ? verses[Math.floor(Math.random() * verses.length)] : null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentCategory('all'); // Clear category when searching
    const verses = searchVerses(query);
    setFilteredVerses(verses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentVerse(verses.length > 0 ? verses[Math.floor(Math.random() * verses.length)] : null);
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleToggleWidgetMinimize = () => {
    setWidgetMinimized((prev) => !prev);
  };

  const handleWidgetDragEnd = useCallback((newPosition: WidgetPosition) => {
    setWidgetPosition(newPosition);
  }, []);

  const handleShareVerse = (verseToShare: Verse) => {
    const shareText = `"${verseToShare.text}" — ${verseToShare.book} ${verseToShare.chapter}:${verseToShare.verse}`;

    if (navigator.share) {
      navigator.share({
        title: 'Bible Verse',
        text: shareText,
        url: window.location.href, // Share the app URL
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Verse copied to clipboard!'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative">
      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={handleToggleDarkMode} />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-white mt-8 md:mt-4">
        Bible Verse App
      </h1>

      <Controls
        onNewVerse={fetchRandomVerse}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        currentCategory={currentCategory}
        categories={availableCategories}
      />

      {filteredVerses.length === 0 && (searchQuery || currentCategory !== 'all') ? (
        <div className="p-6 bg-lightCard dark:bg-darkCard rounded-lg shadow-md mb-6 transition-colors duration-300">
          <p className="text-xl italic text-gray-600 dark:text-gray-400 text-center">
            No verses found for your current selection.
          </p>
        </div>
      ) : (
        <VerseDisplay verse={currentVerse} onShare={handleShareVerse} className="mb-6 flex-grow" />
      )}

      {/* Persistent Widget */}
      <BibleWidget
        verse={currentVerse}
        minimized={widgetMinimized}
        onToggleMinimize={handleToggleWidgetMinimize}
        position={widgetPosition}
        onDragEnd={handleWidgetDragEnd}
      />
    </div>
  );
};

export default App;
