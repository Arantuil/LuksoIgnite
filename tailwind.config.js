/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FE005B',
        reverse: '#01FFA4',
        secondary: '#FFF1F8',
        offBlack: '#0F0F0F',
        offBlackDarker: 'rgb(7,5,5)',
        midGrey: '#CCCCCC',
        softGrey: '#F2F2F2'
      },
      screens: {
        's': {'max': '600px'},
        'xs': {'max': '500px'},
        '2xs': {'max': '450px'},
        '3xs': {'max': '400px'},
        '4xs': {'max': '350px'},
        '5xs': {'max': '325px'},
        '6xs': {'max': '300px'}
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        pingCustom: {
          '0%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
        pingCustom: 'pingCustom 0.1s',
      }
    },
  },
  plugins: [],
}