"use client"

import { useParams } from "next/navigation"

import { useScopedI18n } from "@repo/translation/client"

import type { RoutePaths } from "../_utils/route"
import { buildPaths, replacePathname, routeMap } from "../_utils/route"
import { usePathname } from "../../_shared/hooks/use-pathname"

export function useBreadcrumb() {
  const t = useScopedI18n("routes")
  const pathname = usePathname()
  const params = useParams()
  const asPath = replacePathname(pathname, params) as RoutePaths | undefined
  const segments = asPath?.split("/") ?? []
  const paths = buildPaths(segments)

  const breadcrumbs = paths.map((path) => ({
    path,
    active:
      path === asPath ||
      (routeMap[path].aliases as readonly string[]).includes(asPath ?? ""),
    name: t(routeMap[path].title)
  }))

  return breadcrumbs
}
