
import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onTimeExpired: () => void;
  isPaused: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeExpired, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onTimeExpired();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeExpired, isPaused]);
  
  // Calculate percentage for the progress bar
  const percentage = (timeLeft / duration) * 100;
  
  // Determine color based on time remaining
  let colorClass = "bg-green-500";
  if (percentage < 60) colorClass = "bg-yellow-500";
  if (percentage < 30) colorClass = "bg-red-500";
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>Time Remaining</span>
        <span>{timeLeft} seconds</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
