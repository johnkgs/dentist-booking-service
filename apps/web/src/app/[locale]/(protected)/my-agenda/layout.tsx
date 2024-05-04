import { getI18n } from "@repo/translation/server"
import { Button } from "@repo/ui/button"
import { ChevronLeft, ChevronRight } from "@repo/ui/icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"

export default async function MyAgendaLayout({
  children
}: React.PropsWithChildren) {
  const t = await getI18n()

  return (
    <div className="flex h-[calc(100vh-4.5rem-2px)] flex-col">
      <main className="relative flex flex-col overflow-hidden ring-1 ring-slate-900/10">
        <div className="flex justify-between gap-2 border-b border-gray-100 bg-background px-6 py-4">
          <h1 className="self-center text-md font-medium text-neutral-800">
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
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
