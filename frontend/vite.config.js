import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all available network interfaces
    port: 3000,
    open: false, // Don't auto-open browser when in Docker
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "https://lecturing-system-2.onrender.com"
            : "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Fix CORS issues in production
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    minify: true,
  },
});
