// components/LoadingOverlay.tsx
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      document.body.classList.add('no-scroll');
    } else {
      setTimeout(() => setVisible(false), 300); // Matches the animation duration
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll'); // Clean up on unmount
    };
  }, [isLoading]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 left-0 w-full h-full bg-white backdrop-opacity-55 bg-opacity-5 flex items-center justify-center z-80 overflow-hidden
      ${isLoading ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 transition-opacity duration-300'}
      `}
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4">Processing, please wait...</p>
      </div>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
