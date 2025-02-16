/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    "pending",
    "in_progress",
    "completed",
    "cancelled",
    "on_hold",
    "in_review",
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
      backgroundImage: {
        'chat-light': "url('/chatBackgroundLight.jpg')", // Path to your image
        'chat-dark': "url('./src/assets/images/chatBackgroundDark.jpg')", // Path to your image
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

        pending: '#808080',
        in_progress: '#1E90FF',
        completed: '#32CD32',
        cancelled: '#FF4500',
        on_hold: '#FFA500',
        in_review: '#9370DB',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

