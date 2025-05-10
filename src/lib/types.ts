export type JlptLevelId = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
export type JlptLevel = JlptLevelId | 'All';

export interface VocabularyItem {
  id: string;
  japanese: string;
  reading: string; // Hiragana/Katakana
  meaning: string; // English meaning
  level: JlptLevelId;
  romaji?: string; // Romaji representation
}
