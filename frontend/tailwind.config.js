/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#635bff',
          700: '#5148ff'
        }
      }
    }
  },
  plugins: []
}
