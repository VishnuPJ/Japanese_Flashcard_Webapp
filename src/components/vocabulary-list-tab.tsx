
'use client';

import * as React from 'react';
import type { VocabularyItem, JlptLevel } from '@/lib/types';
import { vocabularyData } from '@/lib/vocabulary';
import { LevelSelector } from '@/components/level-selector';
import { VocabularyListItemCard } from './vocabulary-list-item-card';
import { useAppContext } from '@/context/AppContext';

export function VocabularyListTab() {
  const [selectedLevel, setSelectedLevel] = React.useState<JlptLevel>('N5');
  const [filteredVocab, setFilteredVocab] = React.useState<VocabularyItem[]>([]);
  const { setTargetFlashcardItem } = useAppContext();

  React.useEffect(() => {
    let vocabToSet: VocabularyItem[];
    if (selectedLevel === 'All') {
      vocabToSet = vocabularyData;
    } else {
      vocabToSet = vocabularyData.filter(item => item.level === selectedLevel);
    }
    // Ensure items are sorted by their original ID order from vocabularyData
    vocabToSet.sort((a, b) => {
        const aIndex = vocabularyData.findIndex(v => v.id === a.id);
        const bIndex = vocabularyData.findIndex(v => v.id === b.id);
        return aIndex - bIndex;
    });
    setFilteredVocab(vocabToSet);
  }, [selectedLevel]);

  const handleItemLongPress = (item: VocabularyItem) => {
    setTargetFlashcardItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          {selectedLevel === 'All' ? 'All Vocabulary' : `${selectedLevel} Vocabulary`}
        </h1>
        <LevelSelector selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />
      </div>

      {filteredVocab.length > 0 ? (
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredVocab.map((item, index) => (
            <VocabularyListItemCard 
              key={item.id} 
              item={item} 
              index={index} // This index is for the filtered list
              onLongPress={handleItemLongPress} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">
              No vocabulary items found for {selectedLevel === 'All' ? 'any level' : selectedLevel}.
            </p>
            {selectedLevel !== 'All' && <p className="mt-2 text-sm text-muted-foreground">Try selecting 'All' or a different level.</p>}
        </div>
      )}
    </div>
  );
}
