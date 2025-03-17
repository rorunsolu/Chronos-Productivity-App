import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/__/auth": {
        target: "https://${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com",
        // target: `https://${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`, // Ensure env variable is correctly set
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__\/auth/, "/__/auth"),
      },
    },
  },
});