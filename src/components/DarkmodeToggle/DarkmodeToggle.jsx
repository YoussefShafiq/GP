import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

const DarkmodeToggle = () => {
  const [theme, setTheme] = useState('system'); // 'dark', 'light', or 'system'

  // Check user's preferred theme on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'system';
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  // Apply the theme based on the selection
  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  // Update the theme and save the preference in localStorage
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
  };

  return (
    <div className="flex gap-2 p-2 bg-transparent dark:text-white justify-center rounded-md">
      <button
        onClick={() => handleThemeChange('system')}
        className={`p-2 ${theme === 'system' ? 'text-blue-500' : ''}`}
      >
        <Monitor />
      </button>
      <button
        onClick={() => handleThemeChange('light')}
        className={`p-2 ${theme === 'light' ? 'text-yellow-500' : ''}`}
      >
        <Sun />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`p-2 ${theme === 'dark' ? 'text-blue-500' : ''}`}
      >
        <Moon />
      </button>
    </div>
  );
};

export default DarkmodeToggle;
