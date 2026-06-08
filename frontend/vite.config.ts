import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'xml', 'lcov'],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
      exclude: ['src/data/mock.ts', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
})
