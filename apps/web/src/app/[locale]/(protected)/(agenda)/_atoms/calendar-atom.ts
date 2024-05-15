import { atom } from "jotai"

import type { CalendarEventAPI } from "@repo/ui/calendar-event"

export const appointmentsCalendarAPIAtom = atom<CalendarEventAPI | null>(null)

export const myAppointmentsCalendarAPIAtom = atom<CalendarEventAPI | null>(null)

const appointmentAtoms = {
  appointments: appointmentsCalendarAPIAtom,
  "my-agenda": myAppointmentsCalendarAPIAtom
}

export type AppointmentType = keyof typeof appointmentAtoms

export const getAppointmentsCalendarAPIAtom = (
  type: keyof typeof appointmentAtoms
) => appointmentAtoms[type]
