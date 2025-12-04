
import React, { useState, useEffect, useRef } from 'react';
import { Verse } from '../types';
import { generateVerseReflection } from '../services/geminiService';

interface VerseDisplayProps {
  verse: Verse | null;
  onShare: (verse: Verse) => void;
  className?: string;
  showAiReflection?: boolean;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, onShare, className, showAiReflection = true }) => {
  const [reflection, setReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState<boolean>(false);
  const lastVerseRef = useRef<Verse | null>(null); // To prevent re-generating reflection on every re-render

  const handleGenerateReflection = async () => {
    if (!verse || lastVerseRef.current?.id === verse.id) return; // Only generate if verse changes
    setIsLoadingReflection(true);
    setReflection(null); // Clear previous reflection
    try {
      const aiReflection = await generateVerseReflection(verse);
      setReflection(aiReflection);
      lastVerseRef.current = verse;
    } catch (error) {
      console.error("Error generating reflection:", error);
      setReflection("Failed to load reflection.");
    } finally {
      setIsLoadingReflection(false);
    }
  };

  useEffect(() => {
    // Clear reflection if verse changes or on initial load
    if (verse && lastVerseRef.current?.id !== verse.id) {
      setReflection(null);
      lastVerseRef.current = null; // Reset ref
    }
  }, [verse]);

  if (!verse) {
    return (
      <div className={`p-6 bg-lightCard dark:bg-darkCard rounded-lg shadow-md transition-colors duration-300 ${className}`}>
        <p className="text-xl italic text-gray-600 dark:text-gray-400">
          No verse selected. Please select a category or search for a verse.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-lightCard dark:bg-darkCard rounded-lg shadow-md transition-colors duration-300 ${className}`}>
      <p className="text-2xl md:text-3xl font-serif leading-relaxed mb-4 text-gray-800 dark:text-gray-200">
        “{verse.text}”
      </p>
      <p className="text-lg font-semibold text-primary dark:text-blue-400 text-right mb-4">
        — {verse.book} {verse.chapter}:{verse.verse}
      </p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onShare(verse)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-sm md:text-base"
        >
          Share Verse
        </button>
        {showAiReflection && (
          <button
            onClick={handleGenerateReflection}
            disabled={isLoadingReflection || !!reflection && lastVerseRef.current?.id === verse.id}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingReflection ? 'Generating...' : (reflection ? 'View AI Reflection' : 'Reflect with AI')}
          </button>
        )}
      </div>

      {showAiReflection && reflection && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">AI Reflection:</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reflection}</p>
        </div>
      )}
    </div>
  );
};

export default VerseDisplay;
