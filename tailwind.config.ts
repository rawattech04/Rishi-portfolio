import type { Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'reverse-spin': 'reverse-spin 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'core-pulse': 'core-pulse 2s ease-in-out infinite',
        'text-flicker': 'text-flicker 3s linear infinite',
        'text-flicker-delay': 'text-flicker 3s 0.5s linear infinite',
        'text-flicker-delay2': 'text-flicker 3s 1s linear infinite',
        'energy-wave-1': 'energy-wave 3s ease-out infinite',
        'energy-wave-2': 'energy-wave 3s 0.5s ease-out infinite',
        'energy-wave-3': 'energy-wave 3s 1s ease-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'typing-animation': 'typing 3s steps(40, end)',
        'wave': 'wave 2s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'core-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.95)' },
        },
        'text-flicker': {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.9' },
          '66%': { opacity: '0.95' },
          '77%': { opacity: '0.85' },
        },
        'energy-wave': {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'typing': {
          '0%': { width: '0%', opacity: '0' },
          '10%': { width: '10%', opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(30deg)' },
        },
      },
    },
  },

  plugins: [
    // 👇 Custom plugin to hide scrollbars
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* Chrome, Safari and Opera */
          },
        },
      });
    },
  ],
};

export default config;
