"use client"

import { useQuery } from "convex/react"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

export function LastCallsAppointments() {
  const t = useI18n()
  const lastCalls = useQuery(api.receptionQueue.lastCallsMonitor)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-medium text-neutral-900">
        {t("common.titles.last_calls")}
      </h1>
      <Table className="rounded-md border">
        <TableHeader className="rounded-t-md">
          <TableRow>
            <TableHead>{t("form.labels.name")}</TableHead>
            <TableHead>{t("form.labels.room")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lastCalls?.map((appointment) => (
            <TableRow key={appointment._id} className="odd:bg-muted/20">
              <TableCell>{appointment.patient?.name}</TableCell>
              <TableCell>{appointment.room}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
