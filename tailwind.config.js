/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        e4c: {
          navy:       '#1a3a4a',
          primary:    '#00557b',
          light:      '#5cb1d0',
          mid:        '#3a8fad',
          bg:         '#b8dff0',
          'bg-light': '#e8f5fb',
          hero:       '#3fa9cc',
          gray:       '#f5f7f8',
          'gray-200': '#e8eef1',
          'gray-400': '#9ab0bc',
          'gray-600': '#5a7280',
          dark:       '#1a2a34',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
