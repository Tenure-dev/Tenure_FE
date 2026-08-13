import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // 프록시 중계 대상. 기본은 로컬 백엔드(8080). 로컬 서버 없이 배포 서버로 테스트할 땐
  // .env.local에 VITE_PROXY_TARGET=https://tenure-be.onrender.com 지정.
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080';

  return {
    // sockjs-client가 Node 전역 global을 참조 → 브라우저엔 없어서 window로 매핑
    define: {
      global: 'window',
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      allowedHosts: ['.ts.net', 'paradox-sulfate-diffusion.ngrok-free.dev'], // https 환경에서만 카메라가 켜져서 테스트겸 넣었습니다
      // dev 서버가 proxyTarget으로 중계 (브라우저는 같은 오리진이라 CORS 회피)
      proxy: {
        '/api-proxy': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true, // 웹소켓(SockJS /ws) 업그레이드도 중계
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
          // 배포 서버 CORS 허용목록에 없는 브라우저 Origin(localhost)을 그대로 넘기면
          // Spring CORS 필터가 403을 내므로, 서버-서버 요청처럼 Origin/Referer 제거.
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
            });
          },
        },
        // 업로드 이미지(/files/...)도 백엔드로 중계 (rewrite 없이 경로 그대로)
        '/files': {
          target: proxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
            });
          },
        },
      },
    },
  };
});
