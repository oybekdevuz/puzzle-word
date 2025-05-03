
import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from '../components/GameBoard';
import { words } from '../data/words';

function shuffleWords(wordsArr: typeof words) {
  const shuffled = [...wordsArr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

const Index = () => {
  const [shuffledWords, setShuffledWords] = useState(() => shuffleWords(words));

  const restartGame = useCallback(() => {
    setShuffledWords(shuffleWords(words));
  }, []);
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">So'zlarni top</h1>
          <p className="text-muted-foreground">
            Harflarni ustiga bosib kataklarni to'ldiring. Sizda 10 ta savolni yechish uchun 5ta jon bor!
          </p>
        </header>
        
        <main>
          <GameBoard words={shuffledWords} onRestart={restartGame} />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Kataklarga harflarni qo'yish uchun harflarni ustiga bosing. Orqaga qaytarish uchun esa katakdagi harfga bosing</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
