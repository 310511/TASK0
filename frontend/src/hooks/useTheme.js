import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
