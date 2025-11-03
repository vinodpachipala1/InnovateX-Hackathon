/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pulse-slow': 'pulse 4s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      colors: {
        'dark-bg': '#000000',
        'dark-card': '#111827', // Changed from #0a0a0a to lighter gray
        'dark-card-light': '#1f2937', // Added lighter variant
        'glass-dark': 'rgba(17, 24, 39, 0.8)', // Glass effect
        'glass-light': 'rgba(31, 41, 55, 0.6)', // Lighter glass
        'accent-emerald': '#10b981',
        'accent-cyan': '#06b6d4',
        'accent-cyan-light': '#22d3ee', // Brighter cyan
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.7))',
      }
    },
  },
  plugins: [],
}