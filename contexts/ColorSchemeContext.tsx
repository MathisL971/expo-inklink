// context/ColorSchemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type ModeType = 'light' | 'dark';

const ColorSchemeContext = createContext<{
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}>({
  mode: 'light',
  setMode: () => {},
});

export const ColorSchemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ModeType>('light');
  return (
    <ColorSchemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => useContext(ColorSchemeContext);
