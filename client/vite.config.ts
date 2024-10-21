import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: "localhost",
  //   port: 3000,
  //   proxy: {
  //     // Proxy requests starting with / to the backend server
  //     "/api": {
  //       target: "http://localhost:5000", // Replace with your backend server address
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/api/, ""), // Optionally remove /api prefix
  //     },
  //   },
  // },
});
