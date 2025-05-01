
import React, { useState, useEffect, useCallback } from 'react';
import { WordData } from '../data/words';
import LetterSlot from './LetterSlot';
import VirtualKeyboard from './VirtualKeyboard';
import GameStatus from './GameStatus';
import Timer from './Timer';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  words: WordData[];
}

const GameBoard: React.FC<GameBoardProps> = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const currentWord = words[currentWordIndex]?.word || '';
  const currentHint = words[currentWordIndex]?.hint || '';
  
  // Shuffle letters for the current word
  const shuffleLetters = useCallback((word: string) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }, []);

  // Reset for a new word
  const setupNewWord = useCallback(() => {
    if (currentWordIndex >= words.length) {
      setGameWon(true);
      setGameOver(true);
      return;
    }
    setSelectedLetters([]);
    setShuffledLetters(shuffleLetters(currentWord));
    setTimeExpired(false);
  }, [currentWordIndex, currentWord, shuffleLetters, words.length]);

  // Initialize game
  useEffect(() => {
    setupNewWord();
  }, [currentWordIndex, setupNewWord]);

  // Handle letter click from keyboard
  const handleLetterClick = (letter: string, index: number) => {
    if (selectedLetters.length < currentWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
      
      // Remove letter from shuffled letters
      setShuffledLetters(shuffledLetters.filter((_, i) => i !== index));
    }
  };

  // Handle letter removal from slots
  const handleLetterRemove = (index: number) => {
    if (index >= 0 && index < selectedLetters.length) {
      const removedLetter = selectedLetters[index];
      
      // Add letter back to shuffled letters
      setShuffledLetters([...shuffledLetters, removedLetter]);
      
      // Remove letter from selected letters
      const newSelectedLetters = [...selectedLetters];
      newSelectedLetters.splice(index, 1);
      setSelectedLetters(newSelectedLetters);
    }
  };

  // Submit answer
  const handleSubmit = () => {
    const submittedWord = selectedLetters.join('');
    
    if (submittedWord === currentWord) {
      // Correct answer
      if (currentWordIndex + 1 >= 10) {
        setGameWon(true);
        setGameOver(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    } else {
      // Incorrect answer
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameOver(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    }
  };

  // Handle timer expiration
  const handleTimeExpired = () => {
    setTimeExpired(true);
    setLives(lives - 1);
    
    if (lives - 1 <= 0) {
      setGameOver(true);
    } else {
      // Wait a moment before moving to next word
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
      }, 1500);
    }
  };

  // Restart game
  const handleRestart = () => {
    setCurrentWordIndex(0);
    setLives(5);
    setGameOver(false);
    setGameWon(false);
    setSelectedLetters([]);
  };

  // Render game over or game won screen
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <h1 className="text-4xl font-bold mb-6">
          {gameWon ? "You Win!" : "Game Over"}
        </h1>
        <p className="text-xl mb-8">
          {gameWon 
            ? `Congratulations! You completed all ${Math.min(10, words.length)} words.` 
            : `You ran out of lives! You solved ${currentWordIndex} words.`}
        </p>
        <button
          onClick={handleRestart}
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-primary/80"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <GameStatus lives={lives} currentWord={currentWordIndex + 1} totalWords={Math.min(10, words.length)} />
      
      <div className="w-full mb-6">
        <Timer 
          duration={45} 
          onTimeExpired={handleTimeExpired} 
          isPaused={timeExpired}
        />
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 w-full">
        <h2 className="text-xl font-medium text-center mb-4">Hint: {currentHint}</h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Array.from({ length: currentWord.length }).map((_, index) => (
            <LetterSlot 
              key={index} 
              letter={selectedLetters[index] || ''} 
              onRemove={() => handleLetterRemove(index)}
            />
          ))}
        </div>
      </div>
      
      <VirtualKeyboard 
        letters={shuffledLetters} 
        onLetterClick={handleLetterClick} 
      />
      
      <button 
        onClick={handleSubmit}
        disabled={selectedLetters.length !== currentWord.length}
        className={cn(
          "mt-8 px-8 py-3 rounded-lg font-medium transition-colors",
          selectedLetters.length === currentWord.length 
            ? "bg-primary text-white hover:bg-primary/80" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        )}
      >
        Submit
      </button>
    </div>
  );
};

export default GameBoard;
