import { getI18n } from "@repo/translation/server"
import { Avatar, AvatarFallback } from "@repo/ui/avatar"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { CalendarIcon, XIcon } from "@repo/ui/icons"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from "@repo/ui/popover"
import { Separator } from "@repo/ui/separator"

export default async function Page() {
  const t = await getI18n()

  return (
    <div className="flex flex-auto flex-col overflow-auto bg-background">
      <div className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
        <div className="sticky top-0 z-30 flex-none bg-background shadow ring-1 ring-black/5 sm:pr-8">
          <div className="mr-px grid grid-cols-7 text-sm text-gray-500">
            <div className="col-end-1 w-14"></div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Dom</span>
              <span className="items-center justify-center text-lg text-gray-600">
                21
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Seg</span>
              <span className="items-center justify-center text-lg text-gray-600">
                22
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Ter</span>
              <span className="items-center justify-center text-lg text-gray-600">
                23
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Qua</span>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg text-white">
                24
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Qui</span>
              <span className="items-center justify-center text-lg text-gray-600">
                25
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Sex</span>
              <span className="items-center justify-center text-lg text-gray-600">
                26
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">Sab</span>
              <span className="items-center justify-center text-lg text-gray-600">
                27
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-background ring-1 ring-black/5"></div>
          <div className="grid flex-auto grid-cols-1 grid-rows-1">
            <div className="col-start-1 col-end-2 row-start-1 grid grid-rows-[repeat(24,_minmax(3.5rem,_1fr))] divide-y divide-gray-100">
              <div className="row-end-1 h-6"></div>
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  00:00
                </div>
              </div>
              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  01:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  02:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  03:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  04:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  05:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  06:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  07:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  08:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  09:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  10:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  11:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  12:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  13:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  14:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  15:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  16:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  17:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  18:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  19:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  20:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  21:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  22:00
                </div>
              </div>

              <div>
                <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                  23:00
                </div>
              </div>
            </div>
            <div className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 grid-rows-1 divide-x divide-gray-100">
              <div className="col-start-1"></div>
              <div className="col-start-2"></div>
              <div className="col-start-3"></div>
              <div className="col-start-4"></div>
              <div className="col-start-5"></div>
              <div className="col-start-6"></div>
              <div className="col-start-7"></div>
              <div className="col-start-8 w-8"></div>
            </div>
            <ol className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 grid-rows-[calc(1.5rem)_repeat(192,_minmax(0px,_1fr))_auto] sm:grid-cols-7 sm:pr-8">
              <li className="relative col-start-3 row-[50_/_span_8] flex">
                <Popover>
                  <PopoverTrigger asChild>
                    <a
                      href="#"
                      className="group absolute inset-0 flex flex-col rounded-lg bg-blue-50 p-1 text-xs hover:bg-blue-100"
                    >
                      <p className="truncate font-medium leading-none text-blue-700">
                        John Doe
                      </p>
                      <p className="text-blue-500 group-hover:text-blue-700">
                        <time dateTime="2022-01-12T06:00">06:00 até 07:00</time>
                      </p>
                    </a>
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
              </li>
              <li className="relative col-start-3 row-[62_/_span_24] flex">
                <a
                  href="#"
                  className="group absolute inset-0 flex flex-col rounded-lg bg-red-50 p-1 text-xs hover:bg-red-100"
                >
                  <p className="truncate font-medium leading-none text-red-700">
                    John Doe
                  </p>
                  <p className="text-red-500 group-hover:text-red-700">
                    <time dateTime="2022-01-12T07:30">07:30 até 10:30</time>
                  </p>
                </a>
              </li>
              <li className="relative col-start-6 row-[82_/_span_2] flex">
                <a
                  href="#"
                  className="group absolute inset-0 flex flex-col rounded-lg bg-green-50 p-1 py-0 text-xs hover:bg-green-100"
                >
                  <p className="truncate font-medium leading-none text-green-700">
                    John Doe
                  </p>
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
