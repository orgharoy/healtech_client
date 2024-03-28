/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      // Additional configuration for font feature settings and variation settings
      fontFeatureSettings: {
        sans: 'normal', // Adjust this value as needed
      },
      fontVariationSettings: {
        sans: 'normal', // Adjust this value as needed
      },
    },
  },
  plugins: [],

}