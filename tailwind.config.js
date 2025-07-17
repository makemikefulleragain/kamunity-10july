/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px', // Ultra-wide support for 4-column layouts
      '4xl': '2560px', // Large monitors
    },
    extend: {
      colors: {
        // Kamunity brand colors
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        peach: {
          50: '#fef5e7',
          100: '#fee5d3',
          200: '#fdd6bf',
          300: '#fcbb8a',
          400: '#fa9a4b',
          500: '#f97316',
          600: '#ea580c',
        },
        'pastel-pink': {
          50: '#fef1f7',
          100: '#fee5f2',
          200: '#ffcce7',
          300: '#ffa2d2',
          400: '#ff69b4',
          500: '#ff3d9a',
          600: '#ff0f7b',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        charcoal: '#2d2d2d',
        cream: {
          100: '#fdfbf7',
        },
      },
      fontSize: {
        // Fluid typography system - using clamp() for smooth scaling
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 2.5rem)',
        'fluid-5xl': 'clamp(2.5rem, 2.1rem + 2vw, 3rem)',
        'fluid-6xl': 'clamp(3rem, 2.5rem + 2.5vw, 3.75rem)',
        'fluid-7xl': 'clamp(3.75rem, 3rem + 3.75vw, 4.5rem)',
        'fluid-8xl': 'clamp(4.5rem, 3.5rem + 5vw, 6rem)',
        'fluid-9xl': 'clamp(6rem, 4rem + 10vw, 8rem)',
      },
      spacing: {
        // Fluid spacing system
        'fluid-1': 'clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem)',
        'fluid-2': 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
        'fluid-3': 'clamp(0.75rem, 0.6rem + 0.75vw, 1.125rem)',
        'fluid-4': 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
        'fluid-6': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
        'fluid-8': 'clamp(2rem, 1.6rem + 2vw, 3rem)',
        'fluid-12': 'clamp(3rem, 2.4rem + 3vw, 4.5rem)',
        'fluid-16': 'clamp(4rem, 3.2rem + 4vw, 6rem)',
        'fluid-20': 'clamp(5rem, 4rem + 5vw, 7.5rem)',
        'fluid-24': 'clamp(6rem, 4.8rem + 6vw, 9rem)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'ultra': '120rem', // Ultra-wide container support
      },
      gridTemplateColumns: {
        // Ultra-wide grid support
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        // Responsive grid layouts
        'auto-fit-xs': 'repeat(auto-fit, minmax(16rem, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(20rem, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(24rem, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(28rem, 1fr))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
} 