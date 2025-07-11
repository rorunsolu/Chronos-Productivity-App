import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
//import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
