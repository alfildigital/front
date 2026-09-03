/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#edfafd',
          100: '#d2f3fa',
          200: '#a9e8f5',
          300: '#70d7ee',
          400: '#49bcdb',
          500: '#1f9fbe',
          600: '#177fa0',
          700: '#186783',
          800: '#1b556c',
          900: '#1b485c',
          950: '#0c2f3e',
        },
        secondary: {
          50:  '#f4fbea',
          100: '#e6f5d2',
          200: '#ceecaa',
          300: '#aede78',
          400: '#86c05a',
          500: '#6ba83e',
          600: '#54862e',
          700: '#416827',
          800: '#365325',
          900: '#2f4722',
          950: '#162710',
        },
        surface: {
          light: '#f8fafc',
          dark:  '#0d1f2d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: { color: theme('colors.primary.500') },
            'h1,h2,h3,h4': { color: theme('colors.gray.900') },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.200'),
            a: { color: theme('colors.primary.400') },
            'h1,h2,h3,h4': { color: theme('colors.gray.100') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
