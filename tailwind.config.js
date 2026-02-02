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