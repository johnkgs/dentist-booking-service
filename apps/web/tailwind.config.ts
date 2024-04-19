import type { Config } from "tailwindcss";

import baseConfig from "@repo/tailwind-config/base";

export default {
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
