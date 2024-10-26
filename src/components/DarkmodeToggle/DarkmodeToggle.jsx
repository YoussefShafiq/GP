import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

const DarkmodeToggle = () => {
  const [theme, setTheme] = useState('system'); // 'dark', 'light', or 'system'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md"
      >
        {theme === 'dark' ? <Moon /> : theme === 'light' ? <Sun /> : <Monitor />}
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 w-24 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleThemeChange('system')}
            className={`flex items-center p-2 w-full ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
          >
            <Monitor className="mr-2" />
            System
          </button>
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex items-center p-2 w-full ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
          >
            <Sun className="mr-2" />
            Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center p-2 w-full ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
          >
            <Moon className="mr-2" />
            Dark
          </button>
        </div>
      )}
    </div>
  );
};

export default DarkmodeToggle;
