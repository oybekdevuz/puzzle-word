import React, { useState, useEffect, useCallback } from 'react';
import { WordData } from '../data/words';
import LetterSlot from './LetterSlot';
import VirtualKeyboard from './VirtualKeyboard';
import GameStatus from './GameStatus';
import Timer from './Timer';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface GameBoardProps {
  words: WordData[];
  onRestart?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ words, onRestart }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [trueAnswersCount, setTrueAnswersCount ] = useState(0)

  const currentWord = words[currentWordIndex]?.word || '';
  const currentHint = words[currentWordIndex]?.hint || '';

  // O'zbek morze alifbosi (harflar morze kod tartibida)
  const UZBEK_KEYBOARD_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M","ʻ"],
  ];

  // O'rtadagi harfni topish
  const getMiddleLetter = useCallback((word: string) => {
    if (!word) return '';
    const middleIndex = Math.floor(word.length / 2);
    return word[middleIndex].toUpperCase();
  }, []);
  
  // Yangi so'z uchun qayta sozlash
  const setupNewWord = useCallback(() => {
    if (currentWordIndex >= words.length) {
      setGameWon(true);
      setGameOver(true);
      return;
    }
    setSelectedLetters([]);
    setTimeExpired(false);
    setShowError(false);
  }, [currentWordIndex, words.length]);

  // O'yinni boshlash
  useEffect(() => {
    setupNewWord();
  }, [currentWordIndex, setupNewWord]);

  // Confetti animatsiyasini ishga tushirish
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Yutuqni nishonlash
  useEffect(() => {
    if (gameWon) {
      launchConfetti();
      // Bir necha marta confetti otilishi
      const interval = setInterval(() => {
        launchConfetti();
      }, 700);
      
      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    }
  }, [gameWon]);

  // Klaviaturadan harf tanlash - harflar yo'q bo'lib ketmaydi
  const handleLetterClick = (letter: string) => {
    if (selectedLetters.length < currentWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  // Harfni o'chirib tashlash
  const handleLetterRemove = (index: number) => {
    if (index >= 0 && index < selectedLetters.length) {
      // Faqat tanlangan harflar ro'yxatidan olib tashlash
      const newSelectedLetters = [...selectedLetters];
      newSelectedLetters.splice(index, 1);
      setSelectedLetters(newSelectedLetters);
    }
  };

  // Javobni tekshirish
  const handleSubmit = () => {
    const submittedWord = selectedLetters.join('');
    
    if (submittedWord.toLowerCase() === currentWord) {
      const nextTrueAnswersCount = trueAnswersCount + 1;
      setTrueAnswersCount(nextTrueAnswersCount);
      
      if (currentWordIndex + 1 >= 10) {        
        if(nextTrueAnswersCount == 10){
          setGameWon(true);
        }else {
          setGameWon(false);
        }
        setGameOver(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    } else {
      // Xato javob - qizil fon ko'rsatish
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
      
      // Noto'g'ri javob
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setCurrentWordIndex(currentWordIndex + 1);
        }, 1000);
      }
    }
  };

  // Vaqt tugashi
  const handleTimeExpired = () => {
    setTimeExpired(true);
    setLives(lives - 1);
    
    if (lives - 1 <= 0) {
      setGameOver(true);
    } else {
      // Keyingi so'zga o'tishdan oldin biroz kutish
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
      }, 1500);
    }
  };

  // O'yinni qayta boshlash
  const handleRestart = () => {
    if (onRestart) onRestart();
    setCurrentWordIndex(0);
    setLives(5);
    setGameOver(false);
    setGameWon(false);
    setSelectedLetters([]);
    setShowError(false);
    setGameStarted(false);
  };

  // O'rtadagi harfni ko'rsatadigan komponent
  const MiddleLetter = () => {
    const middleLetter = getMiddleLetter(currentWord);
    return (
      <div className="mb-4 text-center">
        <span className="text-lg font-medium">O'rtadagi harf:</span>
        <span className="ml-2 bg-primary text-white px-3 py-1 rounded-md font-bold text-xl">{middleLetter}</span>
      </div>
    );
  };

  // O'yin tugagan yoki yutilgan holatda ko'rsatish
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
        <h1 className="text-4xl font-bold mb-6">
          {gameWon ? "Siz Yutdingiz! 🎉" : "O'yin tugadi"}
        </h1>
        <p className="text-xl mb-8">
          {gameWon 
            ? `Tabriklayman! Siz barcha ${Math.min(10, words.length)} ta so'zni to'g'ri topdingiz!` 
            : `Afsus siz yutqazdingiz 😕!`}
        </p>
        <button
          onClick={handleRestart}
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-primary/80"
        >
          Qayta o'ynash
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center w-full max-w-xl mx-auto transition-colors duration-300",
      showError ? "bg-red-100" : ""
    )}>
      <GameStatus lives={lives} currentWord={currentWordIndex + 1} totalWords={Math.min(10, words.length)} />
      
      <div className="w-full mb-6">
        {gameStarted && (
          <Timer 
            duration={45} 
            onTimeExpired={handleTimeExpired} 
            isPaused={timeExpired}
          />
        )}
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 w-full">
      {gameStarted && (
        <>
          <h2 className="text-xl font-medium text-center mb-4">Yordam: {currentHint}</h2> 
          <MiddleLetter />
        </>
      )}
        
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {!gameStarted ? (
            <button
              className="w-full py-3 px-6 bg-primary text-white rounded-lg font-bold text-lg"
              onClick={() => setGameStarted(true)}
            >
              O'yinni boshlash
            </button>
          ) : (
            Array.from({ length: currentWord.length }).map((_, index) => (
              <LetterSlot 
                key={index} 
                letter={selectedLetters[index] || ''} 
                onRemove={() => handleLetterRemove(index)}
              />
            ))
          )}
        </div>
      </div>
      
      {gameStarted && (
        <>
          <VirtualKeyboard 
            letters={UZBEK_KEYBOARD_LAYOUT} 
            onLetterClick={(letter) => handleLetterClick(letter)} 
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
            Jo'natish
          </button>
        </>
      )}
    </div>
  );
};

export default GameBoard;