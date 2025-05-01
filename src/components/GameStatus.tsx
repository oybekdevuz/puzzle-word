
import React from 'react';

interface GameStatusProps {
  lives: number;
  currentWord: number;
  totalWords: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ lives, currentWord, totalWords }) => {
  return (
    <div className="flex justify-between w-full mb-4">
      <div className="flex items-center">
        <span className="font-medium mr-2">Lives:</span>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-xl mr-1">
              {i < lives ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
      </div>
      <div>
        <span className="font-medium">Word: {currentWord}/{totalWords}</span>
      </div>
    </div>
  );
};

export default GameStatus;
