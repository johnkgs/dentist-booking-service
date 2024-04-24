export const locales = {
  "pt-br": () => import("./pt-br")
} as const

export const i18nConfig = {
  locales: ["pt-br"],
  defaultLocale: "pt-br"
}
