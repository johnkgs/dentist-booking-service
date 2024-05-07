"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import { useCalendarEvent } from "@repo/ui/calendar-event"
import { ChevronLeft, ChevronRight } from "@repo/ui/icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"

interface Props {
  value: string
  onValueChange: (value: string) => void
}

export function CalendarEventActionHeader(props: Props) {
  const { onValueChange, value } = props
  const { formattedDate, currentDate, goToNext, goToPrev, goToToday } =
    useCalendarEvent()
  const t = useI18n()
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams({
      date: format(currentDate, "yyyy-MM-dd")
    })
    router.push(`/my-agenda/${value}?${params.toString()}`)
  }, [router, currentDate, value])

  return (
    <div className="flex justify-between gap-2 border-b border-gray-100 bg-background px-6 py-4">
      <h1 className="self-center text-md font-medium text-gray-800">
        {formattedDate}
      </h1>
      <div className="flex gap-4">
        <div className="flex items-center">
          <Button
            onClick={goToPrev}
            variant="outline"
            size="icon"
            className="rounded-r-none border-r-0"
          >
            <ChevronLeft className="flex-shrink-0" />
          </Button>
          <Button
            onClick={goToToday}
            variant="outline"
            className="rounded-l-none rounded-r-none border-x-0"
          >
            {t("common.period.today")}
          </Button>
          <Button
            onClick={goToNext}
            variant="outline"
            size="icon"
            className="rounded-l-none border-l-0"
          >
            <ChevronRight className="flex-shrink-0" />
          </Button>
        </div>
        <Select defaultValue={value} onValueChange={onValueChange}>
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
      </div>
    </div>
  )
}
