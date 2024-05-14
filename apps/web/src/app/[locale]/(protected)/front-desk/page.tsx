import Link from "next/link"

import { getI18n } from "@repo/translation/server"
import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/dialog"
import { PlusIcon, ScreenShareIcon, SearchIcon } from "@repo/ui/icons"
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

import { QueueTable } from "./_components/queue-table"

export default async function Page() {
  const t = await getI18n()

  return (
    <div className="rounded-lg bg-background p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end gap-2">
              <Button variant="link" className="text-sm" asChild>
                <Link href="/front-desk/monitor" target="_blank">
                  <ScreenShareIcon className="mr-2 size-5" />
                  {t("routes.front_desk.monitor")}
                </Link>
              </Button>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-3 size-4 text-muted-foreground" />

                  <Input
                    type="search"
                    placeholder={t("form.placeholders.search", {
                      field: t("form.labels.appointment").toLowerCase()
                    })}
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>

                <Select>
                  <SelectTrigger className="font-normal text-muted-foreground sm:w-[300px] md:w-[200px] lg:w-[300px]">
                    <SelectValue placeholder={t("form.labels.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="week">
                        {t("common.appointment_statuses.on_going")}
                      </SelectItem>
                      <SelectItem value="day">
                        {t("common.appointment_statuses.waiting")}
                      </SelectItem>
                      <SelectItem value="month">
                        {t("common.appointment_statuses.finished")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Separator orientation="vertical" />

                <Button variant="outline">
                  {t("form.actions.call_patient")}
                </Button>

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
                      <div className="flex flex-col gap-4 px-2">
                        <Label htmlFor="patient">
                          {t("form.labels.patient")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input id="patient" />
                      </div>
                      <div className="flex flex-col gap-4 px-2">
                        <Label htmlFor="doctor">
                          {t("form.labels.doctor")}
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
                        <Button variant="outline">
                          {t("form.actions.cancel")}
                        </Button>
                      </DialogClose>
                      <Button type="submit">{t("form.actions.save")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <QueueTable />
        </div>
      </div>
    </div>
  )
}
