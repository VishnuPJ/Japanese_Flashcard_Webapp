
'use client';

import * as React from 'react';
import type { VocabularyItem, JlptLevel } from '@/lib/types';
import { vocabularyData } from '@/lib/vocabulary';
import { LevelSelector } from '@/components/level-selector';
import { Flashcard } from '@/components/flashcard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Toggle } from "@/components/ui/toggle";
import { useAppContext } from '@/context/AppContext';

export function FlashcardsTab() {
  const { 
    targetFlashcardItem, 
    setTargetFlashcardItem,
    showRomaji,
    setShowRomaji,
    showMeaning,
    setShowMeaning,
    isAutoShuffleEnabled,
    setIsAutoShuffleEnabled
  } = useAppContext();

  const [selectedLevel, setSelectedLevel] = React.useState<JlptLevel>('N5');
  const [baseVocabForLevel, setBaseVocabForLevel] = React.useState<VocabularyItem[]>([]);
  const [displayedVocab, setDisplayedVocab] = React.useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // Effect 1: Handle external navigation via targetFlashcardItem by setting the selectedLevel.
  React.useEffect(() => {
    if (targetFlashcardItem) {
      setSelectedLevel(targetFlashcardItem.level);
    }
  }, [targetFlashcardItem]);

  // Effect 2: Update base vocabulary when selectedLevel changes.
  React.useEffect(() => {
    const newBaseVocab = selectedLevel === 'All'
      ? [...vocabularyData] 
      : vocabularyData.filter(item => item.level === selectedLevel);
    
    newBaseVocab.sort((a, b) => {
        const aOriginalIndex = vocabularyData.findIndex(v => v.id === a.id);
        const bOriginalIndex = vocabularyData.findIndex(v => v.id === b.id);
        return aOriginalIndex - bOriginalIndex;
    });

    setBaseVocabForLevel(newBaseVocab);

    if (!targetFlashcardItem || (targetFlashcardItem && targetFlashcardItem.level !== selectedLevel)) {
      setCurrentIndex(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedLevel]); 


  // Effect 3: Update displayed vocabulary and current index based on baseVocab, shuffle, and targetItem.
  React.useEffect(() => {
    let newDisplayedVocabList: VocabularyItem[] = [];
    let newCurrentIndex = 0;

    const currentItemBeforeUpdate = displayedVocab[currentIndex];

    if (targetFlashcardItem && targetFlashcardItem.level === selectedLevel) {
      let listForTargetLevel = selectedLevel === 'All'
        ? [...vocabularyData]
        : vocabularyData.filter(item => item.level === selectedLevel);
      
      listForTargetLevel.sort((a, b) => {
        const aOriginalIndex = vocabularyData.findIndex(v => v.id === a.id);
        const bOriginalIndex = vocabularyData.findIndex(v => v.id === b.id);
        return aOriginalIndex - bOriginalIndex;
      });

      const targetIdxInSortedList = listForTargetLevel.findIndex(v => v.id === targetFlashcardItem.id);

      if (targetIdxInSortedList === -1) {
        console.error("Target item not found in its level list:", targetFlashcardItem);
        newDisplayedVocabList = [...baseVocabForLevel]; 
        if (isAutoShuffleEnabled && newDisplayedVocabList.length > 0) {
            newDisplayedVocabList.sort(() => Math.random() - 0.5);
        }
        newCurrentIndex = 0;
      } else {
        if (isAutoShuffleEnabled) {
          const target = listForTargetLevel[targetIdxInSortedList];
          const rest = listForTargetLevel.filter(v => v.id !== targetFlashcardItem.id).sort(() => Math.random() - 0.5);
          newDisplayedVocabList = target ? [target, ...rest] : [...rest.sort(() => Math.random() - 0.5)];
          newCurrentIndex = 0; 
        } else {
          newDisplayedVocabList = [...listForTargetLevel]; 
          newCurrentIndex = targetIdxInSortedList;
        }
      }
      setTargetFlashcardItem(null); 
    } else {
      if (baseVocabForLevel.length === 0) {
        setDisplayedVocab([]);
        setCurrentIndex(0);
        return;
      }

      if (isAutoShuffleEnabled) {
        if (currentItemBeforeUpdate && baseVocabForLevel.some(v => v.id === currentItemBeforeUpdate.id)) {
          const restOfVocab = baseVocabForLevel.filter(item => item.id !== currentItemBeforeUpdate.id);
          const shuffledRest = [...restOfVocab].sort(() => Math.random() - 0.5);
          newDisplayedVocabList = [currentItemBeforeUpdate, ...shuffledRest];
          newCurrentIndex = 0; 
        } else {
          newDisplayedVocabList = [...baseVocabForLevel].sort(() => Math.random() - 0.5);
          newCurrentIndex = 0;
        }
      } else {
        newDisplayedVocabList = [...baseVocabForLevel];
        if (currentItemBeforeUpdate && newDisplayedVocabList.some(v => v.id === currentItemBeforeUpdate.id) ) {
            const idx = newDisplayedVocabList.findIndex(item => item.id === currentItemBeforeUpdate.id);
            newCurrentIndex = idx !== -1 ? idx : 0;
        } else {
            newCurrentIndex = 0; 
        }
      }
    }
    
    setDisplayedVocab(newDisplayedVocabList);
    if (newDisplayedVocabList.length > 0) {
      setCurrentIndex(Math.max(0, Math.min(newCurrentIndex, newDisplayedVocabList.length - 1)));
    } else {
      setCurrentIndex(0);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseVocabForLevel, isAutoShuffleEnabled, selectedLevel, targetFlashcardItem, setTargetFlashcardItem]); 

  const handleNext = () => {
    if (displayedVocab.length <= 1 && !isAutoShuffleEnabled) return;
    if (isAutoShuffleEnabled && displayedVocab.length > 0) {
      if (displayedVocab.length <= 1) return; 
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * displayedVocab.length);
      } while (nextIdx === currentIndex && displayedVocab.length > 1);
      setCurrentIndex(nextIdx);
    } else {
      setCurrentIndex(prev => (prev + 1) % displayedVocab.length);
    }
  };

  const handlePrev = () => {
    if (displayedVocab.length <= 1 && !isAutoShuffleEnabled) return;
    setCurrentIndex(prev => (prev - 1 + displayedVocab.length) % displayedVocab.length);
  };
  
  const handleShuffleToggle = (pressed: boolean) => {
    setIsAutoShuffleEnabled(pressed);
  };

  if (!vocabularyData.length) {
    return <p>Loading vocabulary...</p>;
  }

  const currentItem = displayedVocab.length > 0 && currentIndex < displayedVocab.length ? displayedVocab[currentIndex] : null;
  
  let itemIndexInLevelForDisplay = -1; 
  if (currentItem) {
    const listForLevel = vocabularyData.filter(v => v.level === currentItem.level);
    listForLevel.sort((a, b) => {
        const aOriginalIndex = vocabularyData.findIndex(v => v.id === a.id);
        const bOriginalIndex = vocabularyData.findIndex(v => v.id === b.id);
        return aOriginalIndex - bOriginalIndex;
    });
    itemIndexInLevelForDisplay = listForLevel.findIndex(v => v.id === currentItem.id);
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-lg border bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">Flashcard Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4 md:gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="level-selector" className="text-sm font-medium text-foreground shrink-0">JLPT Level</Label>
              <LevelSelector 
                selectedLevel={selectedLevel} 
                onLevelChange={(level) => {
                  if (targetFlashcardItem) setTargetFlashcardItem(null); 
                  setSelectedLevel(level);
                }} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-romaji" checked={showRomaji} onCheckedChange={setShowRomaji} aria-label="Toggle Romaji visibility" />
              <Label htmlFor="show-romaji" className="cursor-pointer select-none text-sm font-normal text-foreground">Show Romaji</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-meaning" checked={showMeaning} onCheckedChange={setShowMeaning} aria-label="Toggle Meaning visibility" />
              <Label htmlFor="show-meaning" className="cursor-pointer select-none text-sm font-normal text-foreground">Show Meaning</Label>
            </div>
             <div className="flex items-center space-x-2">
              <Toggle
                id="auto-shuffle"
                pressed={isAutoShuffleEnabled}
                onPressedChange={handleShuffleToggle}
                aria-label="Toggle auto shuffle"
                variant="outline"
                className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground shadow-sm"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {currentItem ? (
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center justify-center w-full space-x-2 sm:space-x-4">
            <Button 
              onClick={handlePrev} 
              variant="outline" 
              className="shadow-sm active:scale-95 transition-transform p-3 aspect-square h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-lg border-border hover:bg-muted focus-visible:ring-ring" 
              aria-label="Previous card" 
              disabled={displayedVocab.length <= 1 && !isAutoShuffleEnabled}
            >
              <ChevronLeft className="h-8 w-8 md:h-10 md:w-10 text-foreground" />
            </Button>
            <div className="flex-grow flex justify-center">
              <Flashcard 
                item={currentItem} 
                showRomaji={showRomaji}
                showMeaning={showMeaning}
                itemIndexInLevel={(itemIndexInLevelForDisplay !== -1 ? itemIndexInLevelForDisplay : 0)}
              />
            </div>
            <Button 
              onClick={handleNext} 
              variant="outline" 
              className="shadow-sm active:scale-95 transition-transform p-3 aspect-square h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-lg border-border hover:bg-muted focus-visible:ring-ring" 
              aria-label="Next card" 
              disabled={displayedVocab.length <= 1 && !isAutoShuffleEnabled}
            >
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10 text-foreground" />
            </Button>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground tabular-nums select-none">
              {displayedVocab.length > 0 ? currentIndex + 1 : 0} / {displayedVocab.length}
            </span>
            { currentItem && itemIndexInLevelForDisplay !== -1 &&
              <span className="text-xs text-muted-foreground/80 select-none block">
                (#{itemIndexInLevelForDisplay + 1} in {currentItem.level})
              </span>
            }
          </div>
        </div>
      ) : (
        <Card className="shadow-lg border bg-card">
          <CardContent className="p-10 text-center min-h-80 flex flex-col justify-center items-center">
            <p className="text-xl text-muted-foreground">
              No vocabulary items found for {selectedLevel === 'All' ? 'any level' : selectedLevel}.
            </p>
            {selectedLevel !== 'All' && <p className="mt-2 text-sm text-muted-foreground">Try selecting 'All' or a different level.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

