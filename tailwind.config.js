/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    'bg-finished',
    'bg-NA',
    'bg-started',
    'bg-holding',
  ],
  darkMode: 'class',
  content: [
    "./node_modules/flowbite/**/*.js",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transformStyle: {
        'preserve-3d': {
          'transform-style': 'preserve-3d',
        },
      },
      colors: {
        primary: '#393E46',  // dark gray-blue
        base: '#EEEEEE',  // light gray
        accent: '#51C4D3',  // teal
        darkblue: '#133d57',  // dark teal-blue
        blueblack: '#0b2534',  // most dark teal-blue
        highlight: '#f25287',  // pink-red
        dark: '#111',


        finished: '#7dad4e',
        NA: '#c6001d',
        started: '#49afcd',
        holding: '#b0b0b0',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

