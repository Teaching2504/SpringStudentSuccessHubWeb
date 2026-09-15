export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ouNavy: {
          DEFAULT: '#1e3a8a',
          dark: '#172554',
          hover: '#1e40af',
          light: '#3b82f6',
          subtle: '#eff6ff',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1e3a8a',
          800: '#172554',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}
