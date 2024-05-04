"use client"

import { usePathname as useLocalePathname } from "next/navigation"

import { useCurrentLocale } from "@repo/translation/client"

export function usePathname() {
  const currentLocale = useCurrentLocale()
  const localePathname = useLocalePathname()
  return localePathname.replace(`/${currentLocale}`, "")
}
