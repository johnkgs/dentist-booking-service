import {
  CalendarEventBody,
  CalendarEventGrid,
  CalendarEventHeader,
  CalendarEventTimeIndicator
} from "@repo/ui/calendar-event"

import { CalendarLayout } from "../_components/calendar-layout"
import { Appointments } from "../../_components/appointments"

export default function Page() {
  return (
    <div className="flex flex-auto flex-col overflow-y-auto overflow-x-hidden bg-background">
      <CalendarLayout>
        <CalendarEventHeader />
        <CalendarEventBody>
          <CalendarEventGrid />
          <CalendarEventTimeIndicator />
          <Appointments />
        </CalendarEventBody>
      </CalendarLayout>
    </div>
  )
}
