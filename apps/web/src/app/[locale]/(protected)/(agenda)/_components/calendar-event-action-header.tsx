"use client"

import { useEffect, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { useAtomValue } from "jotai"

import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@repo/ui/icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"
import { Separator } from "@repo/ui/separator"

import type { AppointmentType } from "../_atoms/calendar-atom"
import { getAppointmentsCalendarAPIAtom } from "../_atoms/calendar-atom"

type Props = React.PropsWithChildren<{
  type: AppointmentType
}>

export function CalendarEventActionHeader(props: Props) {
  const { children, type } = props

  const t = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { period } = useParams()
  const calendarAPIAtom = useMemo(
    () => getAppointmentsCalendarAPIAtom(type),
    [type]
  )

  const api = useAtomValue(calendarAPIAtom)

  const defaultValue =
    (period?.toString() as "day" | "week" | undefined) ?? "week"

  useEffect(() => {
    if (!api?.currentDate) return

    const params = new URLSearchParams({
      date: format(api.currentDate, "yyyy-MM-dd")
    })
    router.push(`/${type}/${defaultValue}?${params.toString()}`)
  }, [router, api?.currentDate, defaultValue, type])

  return (
    <div className="flex justify-between gap-2 border-b border-gray-100 bg-background px-6 py-4">
      <h1 className="self-center text-md font-medium text-gray-800">
        {api?.formattedDate}
      </h1>
      <div className="flex gap-4">
        <div className="flex items-center">
          <Button
            onClick={api?.goToPrev}
            variant="outline"
            size="icon"
            className="rounded-r-none border-r-0"
          >
            <ChevronLeftIcon className="flex-shrink-0" />
          </Button>
          <Button
            onClick={api?.goToToday}
            variant="outline"
            className="rounded-l-none rounded-r-none border-x-0"
          >
            {t("common.period.today")}
          </Button>
          <Button
            onClick={api?.goToNext}
            variant="outline"
            size="icon"
            className="rounded-l-none border-l-0"
          >
            <ChevronRightIcon className="flex-shrink-0" />
          </Button>
        </div>
        <Select
          defaultValue={defaultValue}
          onValueChange={(value) => {
            router.push(`/${type}/${value}?${searchParams.toString()}`)
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">{t("common.period.day")}</SelectItem>
              <SelectItem value="week">{t("common.period.week")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {children && (
          <>
            <Separator orientation="vertical" />
            {children}
          </>
        )}
      </div>
    </div>
  )
}
