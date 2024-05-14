import {
  CalendarEventBody,
  CalendarEventGrid,
  CalendarEventHeader,
  CalendarEventTimeIndicator
} from "@repo/ui/calendar-event"

import { CalendarLayout } from "../_components/calendar-layout"
import { MyAppointments } from "./_components/my-appointments"

export default function Page() {
  return (
    <div className="flex flex-auto flex-col overflow-y-auto overflow-x-hidden bg-background">
      <CalendarLayout>
        <CalendarEventHeader />
        <CalendarEventBody>
          <CalendarEventGrid />
          <CalendarEventTimeIndicator />
          <MyAppointments />
        </CalendarEventBody>
      </CalendarLayout>
    </div>
  )
}
