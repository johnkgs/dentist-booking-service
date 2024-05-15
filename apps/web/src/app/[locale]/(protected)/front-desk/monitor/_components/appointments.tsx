"use client"

import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { intlFormat } from "date-fns"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Badge } from "@repo/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

import { SECOND } from "~/app/[locale]/_shared/utils/constants"
import { getStatuses } from "~/app/[locale]/_shared/utils/status"
import { useInterval } from "../../../_hooks/use-interval"

export function Appointments() {
  const t = useI18n()
  const appointments = useQuery(api.receptionQueue.monitor)
  const statuses = useMemo(() => getStatuses(t), [t])
  const [now, setNow] = useState(new Date())

  useInterval(() => {
    setNow(new Date())
  }, SECOND)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-neutral-900">
          {t("common.titles.appointments")}
        </h1>

        <div>
          <span className="text-lg font-medium text-neutral-900">
            {intlFormat(now, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
      </div>
      <Table className="rounded-md border">
        <TableHeader className="rounded-t-md">
          <TableRow>
            <TableHead>{t("form.labels.name")}</TableHead>
            <TableHead>{t("form.labels.appointment")}</TableHead>
            <TableHead>{t("form.labels.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments?.map((appointment) => (
            <TableRow key={appointment._id} className="odd:bg-muted/20">
              <TableCell>{appointment.patient?.name}</TableCell>
              <TableCell>
                {intlFormat(new Date(appointment._creationTime), {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </TableCell>

              <TableCell>
                <Badge colorScheme={statuses[appointment.status].color}>
                  {statuses[appointment.status].text}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
