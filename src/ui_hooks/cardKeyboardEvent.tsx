// src/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';
// todo:parent keyboard输入

export interface CardElement {
  el: HTMLDivElement;
  index: number;
}

interface KeyboardNavigationProps {
  cardsLen: number;
  colCount: number;
  onExit: () => void;
  setSelectedCard: (cardIndex: number) => void;
  currentCardEl: CardElement;
}

const useKeyboardNavigation = ({
  cardsLen,
  colCount,
  onExit,
  currentCardEl,
  setSelectedCard,
}: KeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let newIndex = currentCardEl.index;
      switch (e.key) {
        case 'Escape':
          onExit();
          break;
        case 'ArrowUp':
          newIndex = (newIndex - colCount + cardsLen) % cardsLen;
          break;
        case 'ArrowDown':
          newIndex = (newIndex + colCount) % cardsLen;
          break;
        case 'ArrowRight':
          newIndex = (newIndex + 1) % cardsLen;
          break;
        case 'ArrowLeft':
          newIndex = (newIndex - 1 + cardsLen) % cardsLen;
          break;
        case 'Enter':
          currentCardEl.el?.click()
          break
        default:
          return;
      }

      if (newIndex !== currentCardEl.index) {
        setSelectedCard(newIndex);
        currentCardEl.el?.focus()
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [cardsLen, colCount, onExit, setSelectedCard, currentCardEl]);
};

export default useKeyboardNavigation;