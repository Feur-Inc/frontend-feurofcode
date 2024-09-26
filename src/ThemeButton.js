import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeButton = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.remove('latte-theme');
    } else {
      body.classList.add('latte-theme');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeButton;