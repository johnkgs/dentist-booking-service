import { createI18nServer } from "next-international/server";

import { locales } from "./locales";

export const { getCurrentLocale, getI18n, getScopedI18n, getStaticParams } =
  createI18nServer(locales);

export type Translate = Awaited<ReturnType<typeof getI18n>>;
