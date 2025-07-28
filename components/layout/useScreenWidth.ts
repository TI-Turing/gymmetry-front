import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  return screenWidth;
}
