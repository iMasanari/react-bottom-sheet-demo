import react from '@vitejs/plugin-react'
import molcss from 'molcss/vite-plugin'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    base: process.env.APP_BASE_PATH,
    plugins: [
      react({
        jsxImportSource: 'molcss/react',
      }),
      molcss({
        content: 'src/**/*.{js,jsx,ts,tsx}',
      }),
    ],
  }
})
