/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        disney: {
          blue: '#0D47A0',
          light: '#2E86FF',
          gold: '#FFD700',
        }
      }
    }
  },
  plugins: []
}
