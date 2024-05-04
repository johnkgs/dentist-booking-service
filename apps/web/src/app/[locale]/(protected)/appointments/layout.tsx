import { getI18n } from "@repo/translation/server"
import { Button } from "@repo/ui/button"
import { Checkbox } from "@repo/ui/checkbox"
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

export default async function AppointmentsLayout({
  children
}: React.PropsWithChildren) {
  const t = await getI18n()

  return (
    <div className="grid h-[calc(100vh-4.5rem-2px)] grid-cols-[14rem_1fr]">
      <div className="flex flex-col gap-2 overflow-y-auto bg-background p-4">
        <Input placeholder={t("form.placeholders.search_doctors")} />

        <h2 className="font-medium text-gray-800">
          {t("common.titles.agendas")}
        </h2>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-1" colorScheme="primary" />
            <label
              htmlFor="checkbox-1"
              className="cursor-default text-sm text-gray-900"
            >
              Dr. John Doe
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-2" colorScheme="red" />
            <label
              htmlFor="checkbox-2"
              className="cursor-default text-sm text-gray-900"
            >
              Dr. John Doe
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-3" colorScheme="green" />
            <label
              htmlFor="checkbox-3"
              className="cursor-default text-sm text-gray-900"
            >
              Dr. John Doe
            </label>
          </div>
        </div>
      </div>

      <main className="relative flex flex-col overflow-hidden ring-1 ring-slate-900/10">
        <div className="flex justify-between gap-2 border-b border-gray-100 bg-background px-6 py-4">
          <h1 className="self-center text-md font-medium text-gray-800">
            <time dateTime="2022-01">Abril 2024</time>
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" className="px-2">
              <ChevronLeft className="mr-4 flex-shrink-0" />
              Hoje
              <ChevronRight className="ml-4 flex-shrink-0" />
            </Button>
            <Select defaultValue="week">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="day">{t("common.period.day")}</SelectItem>
                  <SelectItem value="week">
                    {t("common.period.week")}
                  </SelectItem>
                  <SelectItem value="month">
                    {t("common.period.month")}
                  </SelectItem>
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

        {children}
      </main>
    </div>
  )
}
