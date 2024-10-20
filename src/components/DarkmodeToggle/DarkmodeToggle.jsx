import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const DarkmodeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check user's preferred theme on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode and save the preference in localStorage
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-base  dark:bg-gray-800 dark:text-white rounded-md"
    >
      {isDarkMode ? <Moon /> : <Sun />}
    </button>
  );
};

export default DarkmodeToggle;
