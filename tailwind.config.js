/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 13% 95%)',
        text: 'hsl(220 13% 20%)',
        accent: 'hsl(130 70% 55%)',
        border: 'hsl(220 13% 85%)',
        primary: 'hsl(210 100% 50%)',
        surface: 'hsl(220 13% 100%)',
        dark: {
          bg: 'hsl(220 13% 9%)',
          surface: 'hsl(220 13% 12%)',
          text: 'hsl(220 13% 85%)',
          border: 'hsl(220 13% 20%)',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 13%, 20%, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out 3',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
