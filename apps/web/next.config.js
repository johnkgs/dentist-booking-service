/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@repo/ui"],
  redirects: async () => [
    {
      source: "/",
      destination: "/auth/sign-in",
      permanent: false,
    },
    {
      source: "/auth",
      destination: "/auth/sign-in",
      permanent: false,
    },
  ],
};

export default config;
