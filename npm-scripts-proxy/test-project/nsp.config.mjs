import { defineNSPConfig, presets } from "npm-scripts-proxy"
export default defineNSPConfig({
  scripts: [
    {
      cmd: "test",
      script: 'echo "Error: no test specified" && exit 1',
      desc: "--",
    },
  ],
})
