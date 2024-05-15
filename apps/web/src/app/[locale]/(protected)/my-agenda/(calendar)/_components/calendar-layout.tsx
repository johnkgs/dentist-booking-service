"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useSetAtom } from "jotai"

import { CalendarEvent } from "@repo/ui/calendar-event"

import { calendarAPIAtom } from "../../_atoms/calendar-atom"

export function CalendarLayout(props: React.PropsWithChildren) {
  const { children } = props
  const { period } = useParams()
  const searchParams = useSearchParams()
  const value = (period?.toString() as "day" | "week" | undefined) ?? "week"
  const setApi = useSetAtom(calendarAPIAtom)

  return (
    <CalendarEvent
      view={value}
      initialDate={searchParams.get("date") ?? undefined}
      setApi={setApi}
    >
      {children}
    </CalendarEvent>
  )
}
