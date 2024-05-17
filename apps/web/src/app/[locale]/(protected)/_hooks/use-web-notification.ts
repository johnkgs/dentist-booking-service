"use client"

import { useCallback } from "react"

const supportNotification =
  typeof window !== "undefined" && "Notification" in window

type Options = NotificationOptions & {
  title: string
}

export function useWebNotification() {
  const granted = supportNotification && Notification.permission === "granted"

  const requestNotification = async () => {
    if (!supportNotification) return
    return await Notification.requestPermission()
  }

  const webNotify = useCallback(
    (options: Options) => {
      if (!granted) return
      const { title, ...rest } = options

      return new Notification(title, rest)
    },
    [granted]
  )

  return {
    granted,
    webNotify,
    requestNotification
  }
}
