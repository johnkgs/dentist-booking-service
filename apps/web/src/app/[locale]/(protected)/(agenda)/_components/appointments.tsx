"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { format, getUnixTime, intlFormat } from "date-fns"
import { useAtomValue } from "jotai"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  CalendarEventAppointment,
  CalendarEventAppointmentItem
} from "@repo/ui/calendar-event"
import { CalendarIcon, PencilIcon, TrashIcon, XIcon } from "@repo/ui/icons"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/popover"
import { Separator } from "@repo/ui/separator"
import { cn } from "@repo/ui/utils"

import type { AppointmentType } from "../_atoms/calendar-atom"
import { SECOND } from "~/app/[locale]/_shared/utils/constants"
import { getStatuses } from "~/app/[locale]/_shared/utils/status"
import { getAppointmentsCalendarAPIAtom } from "../_atoms/calendar-atom"
import { doctorIdsAtom } from "../_atoms/doctor-atom"

const API_REQUESTS = {
  "my-agenda": api.appointments.mine,
  appointments: api.appointments.list
}

interface Props {
  type: AppointmentType
}

export function Appointments(props: Props) {
  const { type } = props
  const t = useI18n()
  const statuses = useMemo(() => getStatuses(t), [t])
  const calendarAPIAtom = useMemo(
    () => getAppointmentsCalendarAPIAtom(type),
    [type]
  )

  const removeAppointment = useMutation(api.appointments.removeAppointment)
  const editAppointment = useMutation(api.appointments.editAppointment)
  const calendarAPI = useAtomValue(calendarAPIAtom)
  const doctorIds = useAtomValue(doctorIdsAtom)

  const request = API_REQUESTS[type]

  const appointments = useQuery(request, {
    startDate: getUnixTime(calendarAPI?.activePeriod.start ?? 0) * SECOND,
    endDate: getUnixTime(calendarAPI?.activePeriod.end ?? 0) * SECOND,
    doctorIds: type === "appointments" ? doctorIds : undefined
  })

  const handleCallPatient = async (appointmentId: Id<"appointments">) => {
    await editAppointment({ appointmentId, status: "ongoing" })
  }

  const handleFinishAppointment = async (appointmentId: Id<"appointments">) => {
    await editAppointment({ appointmentId, status: "finished" })
  }

  return (
    <CalendarEventAppointment>
      {appointments?.map((appointment, index) => (
        <CalendarEventAppointmentItem
          startDate={appointment.startDate}
          endDate={appointment.endDate}
          key={index}
        >
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "group absolute inset-0 flex flex-col rounded-lg bg-blue-50 p-1 text-xs hover:bg-blue-100",

                  !appointment.showPreviewDate && "py-0"
                )}
              >
                <p className="truncate font-medium leading-none text-blue-700">
                  {appointment.patient?.name}
                </p>
                {appointment.showPreviewDate && (
                  <p className="text-blue-500 group-hover:text-blue-700">
                    <time dateTime="2022-01-12T07:30">
                      {t("form.descriptions.schedule_at", {
                        startDate: intlFormat(appointment.startDate, {
                          hour: "2-digit",
                          minute: "2-digit"
                        }),
                        endDate: intlFormat(appointment.endDate, {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      })}
                    </time>
                  </p>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="size-4 rounded-sm bg-primary" />
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/${type}/edit/${appointment._id}`}>
                        <PencilIcon className="size-5" />
                      </Link>
                    </Button>
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-500/90 hover:text-white"
                        onClick={() =>
                          removeAppointment({ appointmentId: appointment._id })
                        }
                      >
                        <TrashIcon className="size-5" />
                      </Button>
                    </PopoverClose>

                    <PopoverClose asChild>
                      <Button variant="ghost" size="icon">
                        <XIcon />
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <CalendarIcon className="size-4" />
                      <span className="text-xs">{t("form.labels.date")}</span>
                    </div>

                    <span className="text-sm font-medium">
                      {t("form.descriptions.schedule_full_at", {
                        startDate: intlFormat(appointment.startDate, {
                          weekday: "long",
                          day: "2-digit",
                          month: "long"
                        }),
                        startTime: format(appointment.startDate, "HH:mm"),
                        endTime: format(appointment.endDate, "HH:mm")
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <span className="text-xs">{t("form.labels.status")}</span>
                    </div>

                    <Badge colorScheme={statuses[appointment.status].color}>
                      {statuses[appointment.status].text}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs">{t("form.labels.patient")}</span>
                    <span className="truncate text-sm font-medium">
                      {appointment.patient?.name}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs">{t("form.labels.phone")}</span>
                    <span className="truncate text-sm font-medium">
                      {appointment.patient?.phone}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs">{t("form.labels.email")}</span>
                    <span className="truncate text-sm font-medium">
                      {appointment.patient?.email}
                    </span>
                  </div>
                </div>

                {type !== "my-agenda" && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs">
                          {t("form.labels.doctor")}
                        </span>

                        <span className="truncate text-sm font-medium">
                          Dr. {appointment.doctor?.name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs">{t("form.labels.room")}</span>

                        <div className="flex gap-2">
                          <span className="truncate text-sm font-medium">
                            {appointment.room}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {appointment.status === "waiting" && (
                  <div className="flex justify-end">
                    <Button onClick={() => handleCallPatient(appointment._id)}>
                      {t("form.actions.call_patient")}
                    </Button>
                  </div>
                )}
                {appointment.status === "ongoing" && (
                  <div className="flex justify-end">
                    <Button
                      colorScheme="green"
                      onClick={() => handleFinishAppointment(appointment._id)}
                    >
                      {t("form.actions.finish_appointment")}
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </CalendarEventAppointmentItem>
      ))}
    </CalendarEventAppointment>
  )
}
