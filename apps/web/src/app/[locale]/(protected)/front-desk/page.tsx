import Link from "next/link"

import { getI18n } from "@repo/translation/server"
import { Badge } from "@repo/ui/badge"
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
import {
  PencilIcon,
  PlusIcon,
  ScreenShareIcon,
  SearchIcon,
  TrashIcon
} from "@repo/ui/icons"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@repo/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"
import { Separator } from "@repo/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

const appointments = [
  {
    id: "ID001",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID002",
    patient: "John Doe",
    status: "on_going",
    doctor: "John Doe",
    room: "Box 01",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID003",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID004",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID005",
    patient: "John Doe",
    status: "on_going",
    doctor: "John Doe",
    room: "Box 02",
    datetime: "2024-04-28T19:05:03.788Z"
  }
] as const

export default async function Page() {
  const t = await getI18n()

  const statuses = {
    on_going: { color: "red", text: t("common.appointment_statuses.on_going") },
    waiting: { color: "gray", text: t("common.appointment_statuses.waiting") }
  } as const

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
                    placeholder={t("form.placeholders.search_appointment")}
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
                      {t("form.labels.new_appointment")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {t("form.labels.new_appointment")}
                      </DialogTitle>
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

          <div className="flex flex-col gap-4">
            <Table className="rounded-md border">
              <TableHeader className="rounded-t-md">
                <TableRow>
                  <TableHead>{t("form.labels.appointment")}</TableHead>
                  <TableHead>{t("form.labels.patient")}</TableHead>
                  <TableHead>{t("form.labels.doctor")}</TableHead>
                  <TableHead>{t("form.labels.room")}</TableHead>
                  <TableHead>{t("form.labels.status")}</TableHead>
                  <TableHead>{t("form.labels.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((id) => (
                  <TableRow key={id.id} className="odd:bg-muted/20">
                    <TableCell>
                      {new Intl.DateTimeFormat("pt-br", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }).format(new Date(id.datetime))}
                    </TableCell>
                    <TableCell>{id.patient}</TableCell>
                    <TableCell>{id.doctor}</TableCell>
                    <TableCell>{id.room}</TableCell>
                    <TableCell>
                      <Badge colorScheme={statuses[id.status].color}>
                        {statuses[id.status].text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="size-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-500/90 hover:text-white"
                        >
                          <TrashIcon className="size-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  )
}
