"use client"

import { useMemo } from "react"
import { useQuery } from "convex/react"
import { format, getUnixTime, intlFormat } from "date-fns"
import { useAtomValue } from "jotai"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  CalendarEventAppointment,
  CalendarEventAppointmentItem
} from "@repo/ui/calendar-event"
import { CalendarIcon, XIcon } from "@repo/ui/icons"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/popover"
import { Separator } from "@repo/ui/separator"
import { cn } from "@repo/ui/utils"

import { getStatuses } from "~/app/[locale]/_shared/utils/status"
import { calendarAPIAtom } from "../_atoms/calendar-atom"
import { doctorIdsAtom } from "../_atoms/doctor-atom"

export function Appointments() {
  const t = useI18n()
  const statuses = useMemo(() => getStatuses(t), [t])
  const calendarAPI = useAtomValue(calendarAPIAtom)
  const doctorIds = useAtomValue(doctorIdsAtom)

  const appointments = useQuery(api.appointments.list, {
    startDate: getUnixTime(calendarAPI?.activePeriod.start ?? 0),
    endDate: getUnixTime(calendarAPI?.activePeriod.end ?? 0),
    doctorIds
  })

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
                      {intlFormat(appointment.startDate, {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      &nbsp;até&nbsp;
                      {intlFormat(appointment.endDate, {
                        hour: "2-digit",
                        minute: "2-digit"
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

                  <PopoverClose asChild>
                    <Button variant="ghost" size="icon">
                      <XIcon />
                    </Button>
                  </PopoverClose>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <CalendarIcon className="size-4" />
                      <span className="text-xs">{t("form.labels.date")}</span>
                    </div>

                    <span className="text-sm font-medium">
                      {intlFormat(appointment.startDate, {
                        weekday: "long",
                        day: "2-digit",
                        month: "long"
                      })}
                      &nbsp;-&nbsp;
                      {format(appointment.startDate, "HH:mm")}
                      &nbsp;até&nbsp;
                      {format(appointment.endDate, "HH:mm")}
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
                  <div className="col-start-1 col-end-3 flex gap-2">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="text-xs">
                        {t("form.labels.patient")}
                      </span>
                      <span className="truncate text-sm font-medium">
                        {appointment.patient?.name}
                      </span>
                    </div>
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
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs">{t("form.labels.doctor")}</span>

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
              </div>
            </PopoverContent>
          </Popover>
        </CalendarEventAppointmentItem>
      ))}
    </CalendarEventAppointment>
  )
}
