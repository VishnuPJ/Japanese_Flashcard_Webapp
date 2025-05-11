
'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardsTab } from "@/components/flashcards-tab";
import { VocabularyListTab } from "@/components/vocabulary-list-tab";
import { Layers, List } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const { activeTab, setActiveTab, targetFlashcardItem } = useAppContext();

  React.useEffect(() => {
    if (targetFlashcardItem && activeTab !== 'flashcards') {
      setActiveTab('flashcards');
    }
  }, [targetFlashcardItem, activeTab, setActiveTab]);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6 shadow-md">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Vocabulary List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flashcards">
          <FlashcardsTab />
        </TabsContent>
        <TabsContent value="list">
          <VocabularyListTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
