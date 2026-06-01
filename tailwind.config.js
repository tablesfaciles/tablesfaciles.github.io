/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // Plus propre : scanne tous les fichiers HTML à la racine
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      // Vous pouvez ajouter vos propres couleurs ici pour rester cohérent
      colors: {
        quiz: {
          success: '#22c55e', // vert
          warning: '#f97316', // orange
          danger: '#ef4444',  // rouge
        }
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '50%': { 'box-shadow': '0 0 0 10px rgba(239, 68, 68, 0)' },
        }
      },
      animation: {
        'bounce-soft': 'bounce-soft 1s infinite',
        'pulse-scale': 'pulse-scale 0.6s cubic-bezier(0.4, 0, 0.6, 1)',
        'pulse-glow': 'pulse-glow 2s infinite',
      }
    },
  },
  // La Safelist garantit que vos couleurs de barre de progression sont TOUJOURS là
  safelist: [
    'bg-green-500',
    'bg-orange-500',
    'bg-red-500',
    'animate-pulse'
  ],
  plugins: [],
  darkMode: 'media',
}
