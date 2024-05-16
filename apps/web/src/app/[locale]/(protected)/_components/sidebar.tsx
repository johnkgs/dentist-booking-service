"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Protect } from "@clerk/nextjs"

import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import {
  CalendarIcon,
  ClipboardIcon,
  LayoutGridIcon,
  MonitorIcon,
  PillIcon
} from "@repo/ui/icons"

import type { RoutePaths } from "../_utils/route"
import { replacePathname } from "../_utils/route"
import { usePathname } from "../../_shared/hooks/use-pathname"

export function Sidebar() {
  const t = useI18n()

  const sidebar = useMemo(
    () =>
      [
        {
          title: t("routes.home.base"),
          icon: LayoutGridIcon,
          permission: "",
          href: "/home"
        },
        {
          title: t("routes.front_desk.base"),
          icon: MonitorIcon,
          permission: "org:reception:manage",
          href: "/front-desk"
        },
        {
          title: t("routes.appointments.base"),
          icon: CalendarIcon,
          permission: "org:reception:manage",
          href: "/appointments"
        },
        {
          title: t("routes.my_agenda.base"),
          icon: ClipboardIcon,
          permission: "org:patient:manage",
          href: "/my-agenda"
        }
      ] as const,
    [t]
  )

  const pathname = usePathname()
  const params = useParams()
  const asPath = replacePathname(pathname, params) as RoutePaths | undefined

  return (
    <aside
      id="sidebar"
      className="peer/sidebar group/sidebar fixed left-0 top-0 z-[41] h-screen w-16 transition-all hover:w-60"
    >
      <div className="flex h-full flex-col overflow-y-auto overflow-x-hidden border-r border-r-neutral-100 bg-background">
        <div className="border-b border-b-neutral-100 px-3 py-4">
          <a
            href="#"
            className="flex h-10 items-center rounded-lg px-2 text-slate-900"
          >
            <PillIcon className="flex-shrink-0" />
            <span className="invisible ml-3 flex-1 whitespace-nowrap text-base font-semibold transition-[visibility] group-hover/sidebar:visible">
              DentalAPP
            </span>
          </a>
        </div>
        <ul className="gap-2 px-3 py-4 text-sm font-medium">
          {sidebar.map((item) => (
            <Protect
              key={item.title}
              permission={item.permission as ClerkAuthorization["permission"]}
            >
              <li>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full justify-start hover:text-primary data-[active=true]:bg-accent data-[active=true]:text-primary"
                  data-active={asPath?.startsWith(item.href)}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="flex-shrink-0" />
                    <span className="invisible ml-2 flex-1 whitespace-nowrap transition-[visibility] group-hover/sidebar:visible">
                      {item.title}
                    </span>
                  </Link>
                </Button>
              </li>
            </Protect>
          ))}
        </ul>
      </div>
    </aside>
  )
}
