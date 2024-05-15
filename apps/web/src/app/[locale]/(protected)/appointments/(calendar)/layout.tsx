import { Protect } from "@clerk/nextjs"

import { CalendarEventActionHeader } from "./_components/calendar-event-action-header"
import { DoctorList } from "./_components/doctor-list"

export default function AppointmentsLayout({
  children
}: React.PropsWithChildren) {
  return (
    <Protect permission="org:reception:manage">
      <div className="grid h-[calc(100vh-4.5rem-2px)] grid-cols-[14rem_1fr]">
        <DoctorList />

        <main className="relative flex flex-col overflow-hidden ring-1 ring-slate-900/10">
          <CalendarEventActionHeader />
          {children}
        </main>
      </div>
    </Protect>
  )
}
