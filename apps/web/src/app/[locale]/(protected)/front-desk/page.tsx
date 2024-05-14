import Link from "next/link"

import { getI18n } from "@repo/translation/server"
import { Button } from "@repo/ui/button"
import { ScreenShareIcon } from "@repo/ui/icons"
import { Separator } from "@repo/ui/separator"

import { NewScheduleModalForm } from "./_components/new-schedule-modal-form"
import { QueueTable } from "./_components/queue-table"
import { TableFilters } from "./_components/queue-table-filters"

export default async function Page() {
  const t = await getI18n()

  return (
    <div className="rounded-lg bg-background p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end gap-2">
              <Button variant="link" className="text-sm" asChild>
                <Link href="/front-desk/monitor" target="_blank">
                  <ScreenShareIcon className="mr-2 size-5" />
                  {t("routes.front_desk.monitor")}
                </Link>
              </Button>
            </div>
            <div className="flex justify-between gap-4">
              <TableFilters />

              <div className="flex gap-4">
                <Separator orientation="vertical" />

                <Button variant="outline">
                  {t("form.actions.call_patient")}
                </Button>

                <NewScheduleModalForm />
              </div>
            </div>
          </div>

          <QueueTable />
        </div>
      </div>
    </div>
  )
}
