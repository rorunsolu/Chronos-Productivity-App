import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), // Use the defined __dirname
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
