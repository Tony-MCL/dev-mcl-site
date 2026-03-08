import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  // Cloudflare Pages setter denne i build-miljøet
  const isCloudflare = !!process.env.CF_PAGES;

  return {
    plugins: [react()],
    base: isCloudflare ? "/" : "/mcl-website/",
  };
});
