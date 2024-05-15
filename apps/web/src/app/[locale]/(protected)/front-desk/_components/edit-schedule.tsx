"use client"

import { useQuery } from "convex/react"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"

import { EditScheduleModalForm } from "./edit-schedule-modal-form"

interface Props {
  receptionQueueId: Id<"receptionQueue">
}

export function EditSchedule(props: Props) {
  const { receptionQueueId } = props
  const appointment = useQuery(api.receptionQueue.get, {
    receptionQueueId
  })

  if (!appointment) return null

  return <EditScheduleModalForm appointment={appointment} />
}
