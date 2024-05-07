import { getI18n } from "@repo/translation/server"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  CalendarEventAppointment,
  CalendarEventAppointmentItem,
  CalendarEventBody,
  CalendarEventGrid,
  CalendarEventHeader,
  CalendarEventTimeIndicator
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

export default async function Page() {
  const t = await getI18n()

  return (
    <div className="flex flex-auto flex-col overflow-y-auto overflow-x-hidden bg-background">
      <div>
        <CalendarEventHeader />
        <CalendarEventBody>
          <CalendarEventGrid />
          <CalendarEventTimeIndicator />
          <CalendarEventAppointment>
            {[
              {
                startDate: new Date(2024, 4, 7, 6, 0, 0),
                endDate: new Date(2024, 4, 7, 7, 0, 0)
              },
              {
                startDate: new Date(2024, 4, 5, 12, 0, 0),
                endDate: new Date(2024, 4, 5, 15, 0, 0)
              },
              {
                startDate: new Date(2024, 4, 10, 10, 0, 0),
                endDate: new Date(2024, 4, 10, 10, 15, 0)
              }
            ].map((item, index) => (
              <CalendarEventAppointmentItem
                startDate={item.startDate}
                endDate={item.endDate}
                key={index}
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        "group absolute inset-0 flex flex-col rounded-lg bg-red-50 p-1 text-xs hover:bg-red-100",

                        index === 2 && "py-0"
                      )}
                    >
                      <p className="truncate font-medium leading-none text-red-700">
                        John Doe
                      </p>
                      {index !== 2 && (
                        <p className="text-red-500 group-hover:text-red-700">
                          <time dateTime="2022-01-12T07:30">
                            {new Intl.DateTimeFormat("pt-br", {
                              hour: "2-digit",
                              minute: "2-digit"
                            }).format(item.startDate)}
                            &nbsp;até&nbsp;
                            {new Intl.DateTimeFormat("pt-br", {
                              hour: "2-digit",
                              minute: "2-digit"
                            }).format(item.endDate)}
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
                            <span className="text-xs">
                              {t("form.labels.date")}
                            </span>
                          </div>

                          <span className="text-sm font-medium">
                            Terça-feira, 23 de abril - 06:00 até 07:00
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex gap-2">
                            <span className="text-xs">
                              {t("form.labels.status")}
                            </span>
                          </div>

                          <Badge colorScheme="gray">
                            {t("common.appointment_statuses.waiting")}
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
                              John Doe
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs">
                            {t("form.labels.phone")}
                          </span>
                          <span className="truncate text-sm font-medium">
                            +55 27 9 9999-9999
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs">
                            {t("form.labels.email")}
                          </span>
                          <span className="truncate text-sm font-medium">
                            johndoe@gmail.com
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {t("form.labels.doctor")}
                          </span>

                          <span className="truncate text-sm font-medium">
                            Dr. John Doe
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {t("form.labels.doctor_assistant")}
                          </span>

                          <div className="flex gap-2">
                            <span className="truncate text-sm font-medium">
                              Dr. John Doe
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {t("form.labels.room")}
                          </span>

                          <div className="flex gap-2">
                            <span className="truncate text-sm font-medium">
                              Box 01
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
        </CalendarEventBody>
      </div>
    </div>
  )
}
