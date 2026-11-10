/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070b15',
          card: '#0d1527',
          cardBorder: '#1e2d4a',
          hoverBorder: '#3b82f6',
          primary: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          accent: '#6366f1',
          darkText: '#94a3b8',
          lightText: '#f8fafc'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'scan-line': 'scanLine 2.5s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.8)' },
        },
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' }
        }
      }
    },
  },
  plugins: [],
}
