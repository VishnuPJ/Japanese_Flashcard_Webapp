'use client';

import type { JlptLevel } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LevelSelectorProps {
  selectedLevel: JlptLevel;
  onLevelChange: (level: JlptLevel) => void;
}

const levels: JlptLevel[] = ['All', 'N5', 'N4', 'N3', 'N2', 'N1'];

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <Select value={selectedLevel} onValueChange={(value) => onLevelChange(value as JlptLevel)}>
      <SelectTrigger className="w-[180px] shadow-sm">
        <SelectValue placeholder="Select Level" />
      </SelectTrigger>
      <SelectContent>
        {levels.map((level) => (
          <SelectItem key={level} value={level}>
            {level}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
