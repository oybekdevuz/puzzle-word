
import React from 'react';
import { cn } from '@/lib/utils';

interface LetterSlotProps {
  letter: string;
  onRemove: () => void;
}

const LetterSlot: React.FC<LetterSlotProps> = ({ letter, onRemove }) => {
  return (
    <div 
      className={cn(
        "w-12 h-12 md:w-14 md:h-14 border-2 border-primary/30 rounded-lg flex items-center justify-center text-2xl font-bold transition-all",
        letter ? "bg-white shadow-md cursor-pointer" : "bg-primary/10"
      )}
      onClick={() => letter && onRemove()}
    >
      {letter}
    </div>
  );
};

export default LetterSlot;
