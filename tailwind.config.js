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
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        thin: 100,
        extraLight: 200,
        light: 300,
        medium: 500,
        semiBold: 600,
        extraBold: 800,
      },
      transformStyle: {
        'preserve-3d': {
          'transform-style': 'preserve-3d',
        },
      },
      colors: {
        primary: '#393E46',  // dark gray-blue
        base: '#EEEEEE',  // light gray
        light: '#00adb5',  // teal
        darkblue: '#133d57',  // dark teal-blue
        blueblack: '#0b2534',  // most dark teal-blue
        highlight: '#f25287',  // pink-red
        dark: '#111',
        notes: '#35586f',


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

