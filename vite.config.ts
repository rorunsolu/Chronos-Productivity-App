import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      "/__/auth": {
        target: "https://${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__\/auth/, "/__/auth"),
      },
    },
  },
});