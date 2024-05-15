import type { ColumnDef } from "@tanstack/react-table"
import type { FunctionReturnType } from "convex/server"
import { createColumnHelper } from "@tanstack/react-table"
import { intlFormat } from "date-fns"

import type { api } from "@repo/convex/_generated/api"

import type { TableMetaBase } from "../../_types/table-meta"
import { ActionsCell } from "../_components/cells/actions-cell"
import { StatusCell } from "../_components/cells/status-cell"

export type ReceptionQueue = FunctionReturnType<
  typeof api.receptionQueue.list
>["rows"][number]

const columnHelper = createColumnHelper<ReceptionQueue>()

export const queueColumns = [
  columnHelper.accessor("_creationTime", {
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.appointment"),
    cell: (info) =>
      intlFormat(info.getValue(), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
  }),
  columnHelper.accessor("patient.name", {
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.patient")
  }),
  columnHelper.accessor("doctor.name", {
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.doctor")
  }),
  columnHelper.accessor("room", {
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.room")
  }),
  columnHelper.accessor("status", {
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.status"),
    cell: StatusCell
  }),
  {
    id: "actions",
    header: (info) =>
      (info.table.options.meta as TableMetaBase).t("form.labels.actions"),
    cell: ActionsCell
  } satisfies ColumnDef<ReceptionQueue>
]
