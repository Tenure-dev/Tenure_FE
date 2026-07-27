import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    allowedHosts: ['.ts.net'], // https 환경에서만 카메라가 켜져서 테스트겸 넣었습니다
    // 임시: 백엔드 CORS 설정 전까지 dev 서버가 8080으로 중계 (설정되면 제거)
    proxy: {
      '/api-proxy': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
      },
      // 업로드 이미지(/files/...)도 백엔드로 중계 (rewrite 없이 경로 그대로)
      '/files': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
