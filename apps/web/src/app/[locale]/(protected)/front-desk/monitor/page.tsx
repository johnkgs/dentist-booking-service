import { Separator } from "@repo/ui/separator"

import { Appointments } from "./_components/appointments"
import { LastCallsAppointments } from "./_components/last-calls-appointments"
import { MonitorAlert } from "./_components/monitor-alert"

export default function Page() {
  return (
    <div className="rounded-lg bg-background p-4">
      <MonitorAlert />

      <div className="flex flex-col gap-6">
        <Appointments />

        <Separator />

        <LastCallsAppointments />
      </div>
    </div>
  )
}
