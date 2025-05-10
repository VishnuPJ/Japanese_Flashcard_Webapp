
'use client';

import type { VocabularyItem } from '@/lib/types';
import * as React from 'react';
import { useAppContext } from '@/context/AppContext'; 
import { cn } from '@/lib/utils'; 

interface VocabularyListItemCardProps {
  item: VocabularyItem;
  index: number; 
  onLongPress: (item: VocabularyItem) => void;
}

const LONG_PRESS_DURATION = 700; // ms

export function VocabularyListItemCard({ item, index, onLongPress }: VocabularyListItemCardProps) {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = React.useRef<boolean>(false);
  const [isPressing, setIsPressing] = React.useState(false); 
  const { setActiveTab } = useAppContext(); 

  const handleInteractionStart = (event: React.MouseEvent | React.TouchEvent) => {
    // Prevent text selection during long press attempt
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      const target = event.target as HTMLElement;
      if (target.closest('button, input, select, textarea, a[href]')) {
        return; // Don't interfere with native interactive elements
      }
    }
    
    isLongPressTriggered.current = false;
    setIsPressing(true); 
    timerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      onLongPress(item);
      setActiveTab('flashcards'); 
      setIsPressing(false); 
    }, LONG_PRESS_DURATION);
  };

  const handleInteractionEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPressTriggered.current) {
      setIsPressing(false); 
    }
  };
  
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={cn(
        "relative flex w-full overflow-hidden rounded-lg bg-card text-card-foreground",
        "hover:shadow-lg transition-all duration-200 cursor-pointer", // Removed select-none
        isPressing ? "border-2 border-primary shadow-xl scale-[1.01]" : "border border-border shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd} 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent scrolling on space
          setIsPressing(true);
          onLongPress(item);
          setActiveTab('flashcards');
          setTimeout(() => setIsPressing(false), 150); 
        }
      }}
      aria-label={`Vocabulary item: ${item.meaning}. Long press or press Enter/Space to view in flashcards.`}
    >
      {/* Left Side - Main Japanese Word (Kanji or Kana) */}
      <div className="w-28 sm:w-32 md:w-36 flex-shrink-0 bg-secondary/80 p-2 flex flex-col items-center justify-center relative transition-colors duration-200">
        <span className="absolute top-1.5 left-1.5 text-xs text-secondary-foreground opacity-70">
          {index + 1}
        </span>
        <p 
          className="text-center text-secondary-foreground whitespace-nowrap" 
          lang="ja"
          style={{ fontSize: item.japanese.length > 3 ? (item.japanese.length > 5 ? '1.5rem' : '1.8rem') : '2.25rem', fontWeight: 'bold' }}
        >
          {item.japanese}
        </p>
      </div>
      {/* Right Side - Details */}
      <div className="flex-grow p-3 sm:p-4 flex flex-col justify-center space-y-1">
        <div>
          <p className="text-2xl font-semibold text-primary" lang="ja">
            {item.japanese}
          </p>
          {item.japanese !== item.reading && (
            <p className="text-xl text-primary/80" lang="ja">
              {item.reading}
            </p>
          )}
        </div>
        <p className="text-lg text-foreground">{item.meaning}</p>
        {item.romaji && (
          <p className="text-md text-muted-foreground">{item.romaji}</p>
        )}
        <p className="text-sm text-muted-foreground">({item.level})</p>
      </div>
    </div>
  );
}
