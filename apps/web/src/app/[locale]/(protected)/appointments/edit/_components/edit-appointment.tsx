"use client"

import { useQuery } from "convex/react"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"

import { EditAppointmentForm } from "./edit-appointment-form"

interface Props {
  appointmentId: Id<"appointments">
}

export function EditAppointment(props: Props) {
  const { appointmentId } = props
  const appointment = useQuery(api.appointments.get, {
    appointmentId
  })

  if (!appointment) return null

  return <EditAppointmentForm appointment={appointment} />
}
