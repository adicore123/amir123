import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

// Automatically copy the brand logo image to the public folder
try {
  const srcPath = resolve(__dirname, 'WhatsApp Image 2026-05-25 at 23.04.11.jpeg');
  const destPath = resolve(__dirname, 'public/logo.jpg');
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('Successfully copied brand logo to public/logo.jpg');
  }
} catch (err) {
  console.error('Failed to copy brand logo:', err);
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        service: resolve(__dirname, 'service.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
