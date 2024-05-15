"use client"

import { useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useSetAtom } from "jotai"

import { CalendarEvent } from "@repo/ui/calendar-event"

import type { AppointmentType } from "../_atoms/calendar-atom"
import { getAppointmentsCalendarAPIAtom } from "../_atoms/calendar-atom"

type Props = React.PropsWithChildren<{
  type: AppointmentType
}>

export function CalendarLayout(props: Props) {
  const { children, type } = props
  const { period } = useParams()
  const calendarAPIAtom = useMemo(
    () => getAppointmentsCalendarAPIAtom(type),
    [type]
  )
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
