import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkmodeToggle = () => {
  const [theme, setTheme] = useState('system'); // 'dark', 'light', or 'system'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 bg-transparent text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
      >
        {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-fit bg-darkblue text-white rounded-lg shadow-lg z-10"
          >
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex items-center w-full p-3 space-x-2 hover:bg-[#0b2534] transition-colors duration-200 ${theme === 'system' ? 'bg-[#0b2534]' : ''
                }`}
            >
              <Monitor size={18} />
              <span>System</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex items-center w-full p-3 space-x-2 hover:bg-[#0b2534] transition-colors duration-200 ${theme === 'light' ? 'bg-[#0b2534]' : ''
                }`}
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center w-full p-3 space-x-2 hover:bg-[#0b2534] transition-colors duration-200 ${theme === 'dark' ? 'bg-[#0b2534]' : ''
                }`}
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DarkmodeToggle;