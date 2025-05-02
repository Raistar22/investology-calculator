
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MoneyNoteProps {
  index: number;
  onClick: () => void;
}

// Different currency symbols
const CURRENCIES = ['$', '₹', '€', '£', '¥'];

// Individual note component 
const MoneyNote: React.FC<MoneyNoteProps> = ({ index, onClick }) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 5}s`, // Between 5-8s
    animationDelay: `${Math.random() * 2}s`,
    transform: `rotate(${Math.random() * 360}deg)`
  });
  
  // Randomly select currency symbol
  const currency = CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)];

  return (
    <div 
      ref={noteRef}
      className="absolute text-4xl sm:text-5xl md:text-6xl font-bold z-50 cursor-pointer select-none"
      style={{
        top: '-50px',
        left: position.left,
        animation: `falling-money ${position.animationDuration} linear ${position.animationDelay} forwards`,
        transform: position.transform,
        color: `hsl(${Math.random() * 60 + 30}, 80%, 50%)`, // Gold/green-ish colors
        textShadow: '0 0 10px rgba(0,0,0,0.2)'
      }}
      onClick={onClick}
    >
      {currency}
    </div>
  );
};

interface FallingMoneyProps {
  show: boolean;
  onDismiss: () => void;
  notesCount?: number;
}

const FallingMoney: React.FC<FallingMoneyProps> = ({ 
  show, 
  onDismiss, 
  notesCount = 40 
}) => {
  const [notes, setNotes] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate array of indices for the notes when shown
    if (show) {
      setNotes(Array.from({ length: notesCount }, (_, i) => i));
    } else {
      setNotes([]);
    }
  }, [show, notesCount]);
  
  if (!show) return null;
  
  return (
    <>
      <style jsx global>{`
        @keyframes falling-money {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          
          75% {
            opacity: 1;
          }
          
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.8;
          }
        }
      `}</style>
      
      <div 
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity",
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onDismiss}
      >
        {/* Clickable message */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold p-4 bg-black/50 rounded-lg backdrop-blur-md">
          Click anywhere to continue
        </div>
        
        {/* Money notes */}
        {notes.map(index => (
          <MoneyNote key={index} index={index} onClick={onDismiss} />
        ))}
      </div>
    </>
  );
};

export default FallingMoney;
