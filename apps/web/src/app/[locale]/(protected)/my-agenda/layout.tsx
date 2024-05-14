import { Protect } from "@clerk/nextjs"

import { CalendarEventActionHeader } from "./_components/calendar-event-action-header"

export default function MyAgendaLayout({ children }: React.PropsWithChildren) {
  return (
    <Protect permission="org:patient:manage">
      <div className="flex h-[calc(100vh-4.5rem-2px)] flex-col">
        <CalendarEventActionHeader />
        {children}
      </div>
    </Protect>
  )
}
