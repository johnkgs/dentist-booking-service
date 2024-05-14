"use client"

import type { CellContext } from "@tanstack/react-table"
import { useMemo } from "react"

import type { Doc } from "@repo/convex/_generated/dataModel"
import { Badge } from "@repo/ui/badge"

import type { TableMetaBase } from "../../../_types/table-meta"
import { getStatuses } from "~/app/[locale]/_shared/utils/status"

type Props<Type, Value extends string> = CellContext<Type, Value>

export function StatusCell<Type, Value extends Doc<"appointments">["status"]>(
  info: Props<Type, Value>
) {
  const t = (info.table.options.meta as TableMetaBase).t
  const statuses = useMemo(() => getStatuses(t), [t])
  const status = info.getValue()

  return (
    <Badge colorScheme={statuses[status].color}>{statuses[status].text}</Badge>
  )
}
