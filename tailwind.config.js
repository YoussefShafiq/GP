/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class',
  content: [
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
        darkTeal: '#133D57',  // dark teal-blue
        highlight: '#F25287',  // pink-red
      },
    },
  },
  plugins: [],
}

