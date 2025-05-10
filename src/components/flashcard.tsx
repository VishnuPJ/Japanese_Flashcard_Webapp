
'use client';

import type { VocabularyItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface FlashcardProps {
  item: VocabularyItem;
  showRomaji: boolean;
  showMeaning: boolean;
  itemIndexInLevel: number; 
}

export function Flashcard({ item, showRomaji, showMeaning, itemIndexInLevel }: FlashcardProps) {
  return (
    <Card
      className="w-full max-w-md min-h-80 flex flex-col shadow-xl border relative"
      aria-label={`Flashcard for ${item.japanese}`}
    >
      <span className="absolute top-2.5 right-2.5 text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-border/50">
        #{itemIndexInLevel + 1}
      </span>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-6 space-y-3">
        <p className="text-5xl font-bold text-center text-foreground" lang="ja">{item.japanese}</p>
        <p className="text-4xl text-center text-primary" lang="ja">{item.reading}</p>
        {showMeaning && <p className="text-2xl text-center text-foreground/90">{item.meaning}</p>}
        {showRomaji && item.romaji && <p className="text-xl text-center text-muted-foreground">{item.romaji}</p>}
        <p className="text-md text-center text-muted-foreground mt-2">({item.level})</p>
      </CardContent>
    </Card>
  );
}
