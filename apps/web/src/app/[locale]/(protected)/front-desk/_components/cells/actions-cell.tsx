"use client"

import type { CellContext } from "@tanstack/react-table"
import { useMutation } from "convex/react"

import { api } from "@repo/convex/_generated/api"
import { Button } from "@repo/ui/button"
import { TrashIcon } from "@repo/ui/icons"

import type { ReceptionQueue } from "../../_utils/queue-columns"
import type { TableMetaBase } from "../../../_types/table-meta"
import { EditSchedule } from "../edit-schedule"

type Props<Type, Value> = CellContext<Type, Value>

export function ActionsCell<Type extends ReceptionQueue, Value>(
  info: Props<Type, Value>
) {
  const removeAppointment = useMutation(api.receptionQueue.removeSchedule)
  const editSchedule = useMutation(api.receptionQueue.editSchedule)
  const t = (info.table.options.meta as TableMetaBase).t

  const appointment = info.row.original
  if (!appointment) return
  const receptionQueueId = appointment.receptionQueueId

  const handleCallPatient = async () => {
    await editSchedule({ receptionQueueId, status: "ongoing" })
  }

  return (
    <div className="flex items-center gap-2">
      <EditSchedule receptionQueueId={receptionQueueId} />
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:bg-red-500/90 hover:text-white"
        onClick={() => removeAppointment({ receptionQueueId })}
      >
        <TrashIcon className="size-5" />
      </Button>

      {appointment.status === "waiting" && (
        <Button variant="ghost" onClick={handleCallPatient}>
          {t("form.actions.call")}
        </Button>
      )}
    </div>
  )
}
