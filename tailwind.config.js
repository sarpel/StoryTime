/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind'in hangi dosyalardaki class'ları tarayacağını belirtir.
  // Projemizdeki tüm jsx ve html dosyalarını dahil ediyoruz.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
