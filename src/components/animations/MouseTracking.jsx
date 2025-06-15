import { useEffect } from 'react';

const MouseTracking = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.hover-glow');
    
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });

    // Clean up event listeners on component unmount
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  return null;
};

export default MouseTracking;
