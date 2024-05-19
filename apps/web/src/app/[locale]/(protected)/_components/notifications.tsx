"use client"

import { useEffect } from "react"
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"

import { api } from "@repo/convex/_generated/api"
import { formatDistance } from "@repo/shared/utils/date-fns"
import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/card"
import { Checkbox } from "@repo/ui/checkbox"
import { ArchiveIcon, BellIcon, BellRingIcon } from "@repo/ui/icons"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { Switch } from "@repo/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@repo/ui/tooltip"
import { cn } from "@repo/ui/utils"

import { useForceUpdate } from "../_hooks/use-force-update"
import { useInterval } from "../_hooks/use-interval"
import { useSound } from "../_hooks/use-sound"
import { useWebNotification } from "../_hooks/use-web-notification"
import { SECOND } from "../../_shared/utils/constants"

export function Notifications() {
  const t = useI18n()
  const {
    results: notifications,
    isLoading,
    status,
    loadMore
  } = usePaginatedQuery(api.notifications.list, {}, { initialNumItems: 3 })
  const toReadCount = useQuery(api.notifications.toRead)
  const {
    results: watch,
    loadMore: load,
    status: watchStatus
  } = usePaginatedQuery(api.notifications.watch, {}, { initialNumItems: 1 })

  const read = useMutation(api.notifications.read)
  const archive = useMutation(api.notifications.archive)
  const notified = useMutation(api.notifications.notified)
  const [forceUpdate] = useForceUpdate()
  const { granted, requestNotification, webNotify } = useWebNotification()
  const { play } = useSound("/sounds/system-notification.mp3")

  useInterval(() => {
    forceUpdate()
  }, SECOND * 30)

  useEffect(() => {
    const curr = watch[0]
    if (!curr) return

    play()

    webNotify({
      title: curr.title,
      body: curr.description
    })

    void notified({ notificationId: curr._id })

    if (watchStatus === "CanLoadMore") load(1)
  }, [watch, webNotify, play, load, notified, watchStatus])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative">
            <BellIcon className="size-5" />
            {(toReadCount ?? 0) > 0 && (
              <div className="absolute -right-1.5 -top-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-primary text-xxs font-semibold text-white">
                {toReadCount}
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 border-none p-0">
        <Card>
          <CardHeader>
            <CardTitle>{t("common.titles.notifications")}</CardTitle>
            <CardDescription>
              {t("common.descriptions.notifications", {
                count: toReadCount ?? 0
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
              <Switch checked={granted} onCheckedChange={requestNotification} />
            </div>
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="group relative mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span
                    className={cn(
                      "flex size-2 translate-y-1 rounded-full bg-primary",
                      notification.read && "invisible"
                    )}
                  />

                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(
                          notification._creationTime,
                          new Date(),
                          {
                            addSuffix: true
                          }
                        )}
                      </p>

                      <div className="absolute right-0 top-0 hidden items-center gap-2 bg-background px-2 group-hover:flex">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  colorScheme="primary"
                                  className="size-[1.125rem]"
                                  checked={notification.read}
                                  onCheckedChange={(checked) => {
                                    void read({
                                      notificationId: notification._id,
                                      read: Boolean(checked)
                                    })
                                  }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {notification.read
                                  ? t("form.actions.mark_as_unread")
                                  : t("form.actions.mark_as_read")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-auto p-1 text-red-500 hover:bg-red-500/90 hover:text-white"
                                onClick={() =>
                                  archive({ notificationId: notification._id })
                                }
                              >
                                <ArchiveIcon
                                  strokeWidth="1.5"
                                  className="size-5"
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("form.actions.archive")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* TODO: Adicionar link para agendamento */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={status !== "CanLoadMore"}
              isLoading={isLoading}
              onClick={() => loadMore(3)}
            >
              {t("form.actions.see_more")}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
