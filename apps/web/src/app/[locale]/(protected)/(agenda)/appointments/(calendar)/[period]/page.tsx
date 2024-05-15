import {
  CalendarEventBody,
  CalendarEventGrid,
  CalendarEventHeader,
  CalendarEventTimeIndicator
} from "@repo/ui/calendar-event"

import { Appointments } from "../../../_components/appointments"
import { CalendarLayout } from "../../../_components/calendar-layout"

export default function Page() {
  return (
    <div className="flex flex-auto flex-col overflow-y-auto overflow-x-hidden bg-background">
      <CalendarLayout type="appointments">
        <CalendarEventHeader />
        <CalendarEventBody>
          <CalendarEventGrid />
          <CalendarEventTimeIndicator />
          <Appointments type="appointments" />
        </CalendarEventBody>
      </CalendarLayout>
    </div>
  )
}
