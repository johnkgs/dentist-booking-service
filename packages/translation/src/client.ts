"use client";

import { createI18nClient } from "next-international/client";

import { locales } from "./locales";

export const {
  useChangeLocale,
  useCurrentLocale,
  useI18n,
  useScopedI18n,
  I18nProviderClient,
} = createI18nClient(locales);
