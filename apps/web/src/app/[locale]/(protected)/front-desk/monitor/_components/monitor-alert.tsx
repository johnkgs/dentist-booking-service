"use client"

import type { FunctionReturnType } from "convex/server"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@repo/ui/alert-dialog"

import { SECOND } from "~/app/[locale]/_shared/utils/constants"
import { useSound } from "../../../_hooks/use-sound"

export function MonitorAlert() {
  const t = useI18n()
  const [open, onOpenChange] = useState(false)
  const { play } = useSound("/sounds/system-notification.mp3")
  const lastCalls = useQuery(api.receptionQueue.lastCallsQueueMonitor)
  const call = useMutation(api.receptionQueue.call)

  const [currentCall, setCurrentCall] = useState<
    | FunctionReturnType<
        NonNullable<typeof api.receptionQueue.lastCallsQueueMonitor>
      >[number]
    | null
  >(null)

  useEffect(() => {
    const curr = lastCalls?.[0]
    if (!curr) return

    setCurrentCall((prev) => prev ?? curr)
  }, [lastCalls])

  useEffect(() => {
    if (!currentCall) return

    play()
    onOpenChange(true)

    const timeoutId = setTimeout(() => {
      onOpenChange(false)
      void call({ receptionQueueId: currentCall.receptionQueueId })
      setCurrentCall(null)
    }, SECOND * 5)
    return () => clearTimeout(timeoutId)
  }, [call, play, currentCall])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            {currentCall?.patient?.name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md text-gray-500">
            {t("form.descriptions.please_go_to_room", {
              room: currentCall?.room
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
