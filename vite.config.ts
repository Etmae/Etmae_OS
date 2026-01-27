import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr(), mkcert() ],
  server: {
    port: 5173,
    open: true,
    https: {},
    strictPort: true,
    host: true,
  }

});

