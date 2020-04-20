import { useState, useEffect } from 'react';

const useKeyPress = (targetKeyCode) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDownHandler = ({ keyCode }) => {
    setKeyPressed((keyCode === targetKeyCode) || keyPressed);
  };
  const keyUpHandler = ({ keyCode }) => {
    setKeyPressed(!(keyCode === targetKeyCode) && keyPressed);
  };

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    }
  }, []);

  return keyPressed;
}

export default useKeyPress;
