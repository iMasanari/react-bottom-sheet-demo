import react from '@vitejs/plugin-react'
import molcss from 'molcss/vite-plugin'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'molcss/react',
    }),
    molcss({
      content: 'src/**/*.{js,jsx,ts,tsx}',
    }),
  ],
})
