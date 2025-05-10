
'use client';

import type { VocabularyItem } from '@/lib/types';
import * as React from 'react';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  targetFlashcardItem: VocabularyItem | null;
  setTargetFlashcardItem: (item: VocabularyItem | null) => void;
  showRomaji: boolean;
  setShowRomaji: (show: boolean) => void;
  showMeaning: boolean;
  setShowMeaning: (show: boolean) => void;
  isAutoShuffleEnabled: boolean;
  setIsAutoShuffleEnabled: (enabled: boolean) => void;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = React.useState<string>('flashcards');
  const [targetFlashcardItem, setTargetFlashcardItemState] = React.useState<VocabularyItem | null>(null);
  const [showRomaji, setShowRomajiState] = React.useState<boolean>(false);
  const [showMeaning, setShowMeaningState] = React.useState<boolean>(false);
  const [isAutoShuffleEnabled, setIsAutoShuffleEnabledState] = React.useState<boolean>(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const setTargetFlashcardItem = (item: VocabularyItem | null) => {
    setTargetFlashcardItemState(item);
  };

  const setShowRomaji = (show: boolean) => {
    setShowRomajiState(show);
  };

  const setShowMeaning = (show: boolean) => {
    setShowMeaningState(show);
  };

  const setIsAutoShuffleEnabled = (enabled: boolean) => {
    setIsAutoShuffleEnabledState(enabled);
  };

  return (
    <AppContext.Provider value={{ 
      activeTab, 
      setActiveTab, 
      targetFlashcardItem, 
      setTargetFlashcardItem,
      showRomaji,
      setShowRomaji,
      showMeaning,
      setShowMeaning,
      isAutoShuffleEnabled,
      setIsAutoShuffleEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

