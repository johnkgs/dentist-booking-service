"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"

import { CalendarEvent } from "@repo/ui/calendar-event"

import { CalendarEventActionHeader } from "./calendar-event-action-header"

export function CalendarLayout(props: React.PropsWithChildren) {
  const { children } = props
  const { period } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const value = (period?.toString() as "day" | "week" | undefined) ?? "week"

  return (
    <CalendarEvent
      view={value}
      initialDate={searchParams.get("date") ?? undefined}
    >
      <CalendarEventActionHeader
        value={value}
        onValueChange={(value) => {
          router.push(`/my-agenda/${value}?${searchParams.toString()}`)
        }}
      />

      {children}
    </CalendarEvent>
  )
}
