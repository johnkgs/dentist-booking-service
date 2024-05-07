import { Protect } from "@clerk/nextjs"

import { getI18n } from "@repo/translation/server"
import { Checkbox } from "@repo/ui/checkbox"
import { Input } from "@repo/ui/input"

import { CalendarLayout } from "./_components/calendar-layout"

export default async function AppointmentsLayout({
  children
}: React.PropsWithChildren) {
  const t = await getI18n()

  return (
    <Protect permission="org:reception:manage">
      <div className="grid h-[calc(100vh-4.5rem-2px)] grid-cols-[14rem_1fr]">
        <div className="flex flex-col gap-2 overflow-y-auto bg-background p-4">
          <Input placeholder={t("form.placeholders.search_doctors")} />

          <h2 className="font-medium text-gray-800">
            {t("common.titles.agendas")}
          </h2>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-1" colorScheme="primary" />
              <label
                htmlFor="checkbox-1"
                className="cursor-default text-sm text-gray-900"
              >
                Dr. John Doe
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-2" colorScheme="red" />
              <label
                htmlFor="checkbox-2"
                className="cursor-default text-sm text-gray-900"
              >
                Dr. John Doe
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-3" colorScheme="green" />
              <label
                htmlFor="checkbox-3"
                className="cursor-default text-sm text-gray-900"
              >
                Dr. John Doe
              </label>
            </div>
          </div>
        </div>

        <main className="relative flex flex-col overflow-hidden ring-1 ring-slate-900/10">
          <CalendarLayout>{children}</CalendarLayout>
        </main>
      </div>
    </Protect>
  )
}
