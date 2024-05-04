"use client"

import { usePathname } from "~/app/[locale]/_shared/hooks/use-pathname"

const ROUTES_TO_HIDE = ["/front-desk/monitor"]

export function HideLayout(props: React.PropsWithChildren) {
  const { children } = props
  const pathname = usePathname()

  if (ROUTES_TO_HIDE.includes(pathname)) return null

  return <>{children}</>
}
