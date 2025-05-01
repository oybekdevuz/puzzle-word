
import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import { words } from '../data/words';

const Index = () => {
  const [shuffledWords, setShuffledWords] = useState(words);
  
  useEffect(() => {
    // Shuffle the words array
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    // Take only 10 words, or fewer if not enough words
    setShuffledWords(shuffled.slice(0, 10));
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
      <div className="container px-4 py-8 mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">Word Puzzle Challenge</h1>
          <p className="text-muted-foreground">
            Drag or click letters to form words. You have 5 lives to solve 10 puzzles!
          </p>
        </header>
        
        <main>
          <GameBoard words={shuffledWords} />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Drag letters to the slots or click to place them. Click on placed letters to remove.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
