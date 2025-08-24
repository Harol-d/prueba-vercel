import React, { useState, useEffect, useMemo, useCallback } from 'react';

const TypingAnimation = ({ fullText, typingSpeed = 8, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Optimización: memorizar valores para evitar cálculos repetidos
  const textLength = useMemo(() => fullText?.length || 0, [fullText]);
  const chunkSize = useMemo(() => textLength > 200 ? 3 : textLength > 100 ? 2 : 1, [textLength]);
  
  // Memorizar callback para evitar recreaciones innecesarias
  const handleComplete = useCallback(() => {
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!fullText || isComplete) return;

    if (currentIndex < textLength) {
      const timer = setTimeout(() => {
        // Optimización: usar chunk size memorizado para mejor rendimiento
        const nextIndex = Math.min(currentIndex + chunkSize, textLength);
        
        setDisplayedText(fullText.substring(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      handleComplete();
    }
  }, [currentIndex, fullText, typingSpeed, isComplete, textLength, chunkSize, handleComplete]);

  // Resetear cuando cambie el texto completo
  useEffect(() => {
    if (fullText) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [fullText]);

  // Optimización: no renderizar si no hay texto
  if (!fullText) {
    return null;
  }

  return (
    <div className="typing-animation">
      {displayedText}
      {!isComplete && <span className="typing-cursor">|</span>}
    </div>
  );
};

export default TypingAnimation;
