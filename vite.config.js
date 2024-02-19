import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [VitePWA({ registerType: "autoUpdate" })],

  mode: "universal",

  server: {
    host: "0.0.0.0",
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "ssl/private.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "ssl/certificate.crt")),
      ca: fs.readFileSync(path.resolve(__dirname, "ssl/ca_bundle.crt")),
    },
  },
});
