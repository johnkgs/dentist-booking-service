"use client"

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

  function webNotify(options: Options) {
    if (!supportNotification) return
    const { title, ...rest } = options

    return new Notification(title, rest)
  }

  return {
    granted,
    webNotify,
    requestNotification
  }
}
