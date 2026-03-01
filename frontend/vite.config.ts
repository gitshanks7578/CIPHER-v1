import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base : './',
  build : {
    outDir : "dist-react"
  },
  server:{
    port:5123,
    strictPort:true
  }
  //for hot module reloading (HMR) side by side for efficient dev exp
  //electron and vite runs separately for equal changes to show up electron needs to know the exact port vite is serving on
  //vite's default behavior can make it skip the port if unavailable so we set strictport = true
})
