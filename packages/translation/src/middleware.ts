import { createI18nMiddleware } from "next-international/middleware"

import { i18nConfig } from "./locales"

const i18nMiddleware = createI18nMiddleware(i18nConfig)

export { i18nConfig, i18nMiddleware }
