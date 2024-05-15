"use client"

import { Fragment } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"

import { useI18n } from "@repo/translation/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@repo/ui/breadcrumb"
import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/card"
import { BellIcon, BellRingIcon, CheckIcon } from "@repo/ui/icons"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { Switch } from "@repo/ui/switch"

import { useBreadcrumb } from "../_hooks/use-breadcrumb"

const notifications = [
  {
    title: "John Doe está aguardando atendimento",
    description: "1 hora atrás"
  },
  {
    title: "Atendimento de John Doe finalizado com sucesso!",
    description: "2 horas atrás"
  }
]

export function Header() {
  const breadcrumbs = useBreadcrumb()
  const t = useI18n()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-neutral-100 bg-background">
      <div className="flex items-center justify-between p-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.path}>
                <BreadcrumbItem>
                  {breadcrumb.active ? (
                    <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.path}>
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <BellIcon className="size-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-96 border-none p-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("common.titles.notifications")}</CardTitle>
                  <CardDescription>
                    {t("common.descriptions.notifications", {
                      count: notifications.length
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <BellRingIcon />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {t("form.actions.enable_notifications")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("common.descriptions.send_notifications_to_device")}
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex size-2 translate-y-1 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={notifications.length === 0}
                  >
                    <CheckIcon className="mr-2 size-4" />{" "}
                    {t("form.actions.mark_all_as_read")}
                  </Button>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>

          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
