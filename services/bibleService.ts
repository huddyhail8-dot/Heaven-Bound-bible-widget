
import bibleVersesData from '../data/bibleVerses.json';
import { Verse, VerseCategory } from '../types';

const allVerses: Verse[] = bibleVersesData;

export const getVerses = (): Verse[] => {
  return allVerses;
};

export const getRandomVerse = (): Verse | undefined => {
  if (allVerses.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * allVerses.length);
  return allVerses[randomIndex];
};

export const getVersesByCategory = (category: VerseCategory | 'all'): Verse[] => {
  if (category === 'all') {
    return allVerses;
  }
  return allVerses.filter(verse => verse.category.includes(category));
};

export const searchVerses = (query: string): Verse[] => {
  const lowerCaseQuery = query.toLowerCase().trim();
  if (!lowerCaseQuery) {
    return allVerses;
  }
  return allVerses.filter(verse =>
    verse.text.toLowerCase().includes(lowerCaseQuery) ||
    verse.book.toLowerCase().includes(lowerCaseQuery) ||
    verse.keywords?.some(keyword => keyword.toLowerCase().includes(lowerCaseQuery))
  );
};
