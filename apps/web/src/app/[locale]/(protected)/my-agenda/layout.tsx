import { Protect } from "@clerk/nextjs"

import { CalendarLayout } from "./_components/calendar-layout"

export default function MyAgendaLayout({ children }: React.PropsWithChildren) {
  return (
    <Protect permission="org:patient:manage">
      <div className="flex h-[calc(100vh-4.5rem-2px)] flex-col">
        <CalendarLayout>{children}</CalendarLayout>
      </div>
    </Protect>
  )
}
