import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remplace "option-probability-calculator" par le nom exact de ton dépôt GitHub.
// Pour un dépôt https://USERNAME.github.io/, utilise simplement base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/option-probability-calculator/',
})