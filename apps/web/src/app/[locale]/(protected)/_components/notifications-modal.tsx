"use client"

import { useEffect, useState } from "react"

import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/dialog"

import { useWebNotification } from "../_hooks/use-web-notification"

export function NotificationsModal() {
  const [open, onOpenChange] = useState(false)
  const { granted, requestNotification } = useWebNotification()
  const t = useI18n()

  useEffect(() => {
    if (granted) return
    onOpenChange(true)
  }, [granted])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-[425px]"
        position="bottom-right"
        showOverlay={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {t("common.titles.do_you_wanna_receive_notification")}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {t("common.descriptions.device_notification", {
            continue: <b>{t("form.actions.continue")}</b>,
            permission: <b>{t("form.actions.permission")}</b>
          })}
        </DialogDescription>

        <DialogFooter>
          <Button type="submit" onClick={requestNotification}>
            {t("form.actions.continue")}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost">{t("form.actions.no")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
