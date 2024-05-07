"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import { useCalendarEvent } from "@repo/ui/calendar-event"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/dialog"
import { ChevronLeft, ChevronRight, PlusIcon } from "@repo/ui/icons"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"
import { Separator } from "@repo/ui/separator"

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
    router.push(`/appointments/${value}?${params.toString()}`)
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

        <Separator orientation="vertical" />

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2" />
              {t("form.labels.new_schedule")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("form.labels.new_schedule")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="md">
                  Segunda-feira, 29 de abril
                </Button>
                <Button variant="ghost" size="md">
                  08:15
                </Button>
                <span>-</span>
                <Button variant="ghost" size="md">
                  09:30
                </Button>
              </div>
              <div className="flex flex-col gap-4 px-2">
                <Label htmlFor="patient">
                  {t("form.labels.patient")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input id="patient" />
              </div>
              <div className="flex flex-col gap-4 px-2">
                <Label htmlFor="doctor">
                  {t("form.labels.doctor")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input id="doctor" />
              </div>

              <div className="flex flex-col gap-4 px-2">
                <Label htmlFor="doctor-assistant">
                  {t("form.labels.doctor_assistant")}
                </Label>
                <Input id="doctor-assistant" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("form.actions.cancel")}</Button>
              </DialogClose>
              <Button type="submit">{t("form.actions.save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
