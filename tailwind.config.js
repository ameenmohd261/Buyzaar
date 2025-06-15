// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: 'class',
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ['Inter', 'sans-serif'],
//         sora: ['Sora', 'sans-serif'],
//       },
//       colors: {
//         primary: 'var(--primary)',
//         'primary-dark': 'var(--primary-dark)',
//         accent: 'var(--accent)',
//         'accent-dark': 'var(--accent-dark)',
//         background: 'var(--background)',
//         'card-bg': 'var(--card-bg)',
//         'text-secondary': 'var(--text-secondary)',
//         success: 'var(--success)',
//         warning: 'var(--warning)',
//         error: 'var(--error)',
//       },
//       animation: {
//         'float': 'float 6s ease-in-out infinite',
//         'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'spin-slow': 'spin 8s linear infinite',
//         'gradient': 'gradient 8s ease infinite',
//         'slide-up': 'slide-up 0.5s ease-out',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         gradient: {
//           '0%, 100%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//         },
//         'slide-up': {
//           '0%': { transform: 'translateY(20px)', opacity: 0 },
//           '100%': { transform: 'translateY(0)', opacity: 1 },
//         },
//       },
//       backgroundSize: {
//         'auto': 'auto',
//         'cover': 'cover',
//         'contain': 'contain',
//         '200%': '200% 200%',
//       },
//     },
//   },
//   plugins: [
//     require('@tailwindcss/forms'),
//     require('@tailwindcss/typography'),
//   ],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        background: 'var(--background)',
        'card-bg': 'var(--card-bg)',
        'text-secondary': 'var(--text-secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}