/* eslint-disable no-undef */
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@store": path.resolve(__dirname, "src/store"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["localhost", "bosquesrl.com", "bosquesrl.online"],
    hmr: {
      protocol: "wss",
      host: "bosquesrl.com",
      port: 443,
    },
  },
});
