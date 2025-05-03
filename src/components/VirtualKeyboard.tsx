import React from 'react';
import { cn } from '@/lib/utils';

interface VirtualKeyboardProps {
  letters: string[][];
  onLetterClick: (letter: string) => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ letters, onLetterClick }) => {
  return (
    <div className="w-full">
      {letters.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((letter, letterIndex) => (
            <button
              key={`${rowIndex}-${letterIndex}`}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-md font-medium text-lg",
                "bg-white/90 border border-gray-200 shadow-sm",
                "hover:bg-primary hover:text-white transition-colors",
                letter.length > 1 ? "w-16" : "w-10" // Kattaroq tugma maxsus harflar uchun
              )}
              onClick={() => onLetterClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;