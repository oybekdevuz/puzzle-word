
import React from 'react';

interface VirtualKeyboardProps {
  letters: string[];
  onLetterClick: (letter: string, index: number) => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ letters, onLetterClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full">
      {letters.map((letter, index) => (
        <button
          key={index}
          className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-lg text-xl font-bold 
                   shadow-md hover:bg-primary hover:text-white transition-colors 
                   active:scale-95 transform"
          onClick={() => onLetterClick(letter, index)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
