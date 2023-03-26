// vite.config.ts
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
console.log("process", process.env.NODE_ENV);
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    preprocessorOptions: {
      less: {
        charset: false
      }
    }
  }
});
export {
  vite_config_default as default
};
