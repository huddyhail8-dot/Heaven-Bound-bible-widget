
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Verse, WidgetPosition } from '../types';

interface BibleWidgetProps {
  verse: Verse | null;
  minimized: boolean;
  onToggleMinimize: () => void;
  position: WidgetPosition;
  onDragEnd: (newPosition: WidgetPosition) => void;
}

const BibleWidget: React.FC<BibleWidgetProps> = ({
  verse,
  minimized,
  onToggleMinimize,
  position,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (minimized) return; // Don't drag if minimized
    setIsDragging(true);
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [minimized]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Prevent dragging off-screen
      newX = Math.max(0, Math.min(newX, window.innerWidth - (widgetRef.current?.offsetWidth || 0)));
      newY = Math.max(0, Math.min(newY, window.innerHeight - (widgetRef.current?.offsetHeight || 0)));

      onDragEnd({ x: newX, y: newY });
    },
    [isDragging, dragOffset, onDragEnd]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 bg-lightCard dark:bg-darkCard rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
                  ${minimized ? 'w-48 h-16 bottom-4 right-4' : 'w-72 md:w-96 p-4'}
                  ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-primary dark:text-blue-400">Verse Widget</h3>
        <button
          onClick={onToggleMinimize}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label={minimized ? 'Maximize Widget' : 'Minimize Widget'}
        >
          {minimized ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 16.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          )}
        </button>
      </div>

      {!minimized && verse && (
        <div className="text-gray-800 dark:text-gray-200">
          <p className="text-sm italic mb-1 line-clamp-3">{verse.text}</p>
          <p className="text-xs font-semibold text-primary dark:text-blue-400 text-right">
            — {verse.book} {verse.chapter}:{verse.verse}
          </p>
        </div>
      )}

      {minimized && verse && (
        <p className="text-xs text-gray-800 dark:text-gray-200 italic overflow-hidden whitespace-nowrap text-ellipsis">
          "{verse.text.substring(0, 40)}..."
        </p>
      )}

      {(!verse && !minimized) && (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading verse...</p>
      )}
    </div>
  );
};

export default BibleWidget;
