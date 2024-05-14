import { atom } from "jotai"

import type { CalendarEventAPI } from "@repo/ui/calendar-event"

export const calendarAPIAtom = atom<CalendarEventAPI | null>(null)
