"use client"

import { useMemo } from "react"
import { useAtom } from "jotai"

import type { Doc } from "@repo/convex/_generated/dataModel"
import { useI18n } from "@repo/translation/client"
import { SearchIcon } from "@repo/ui/icons"
import { Input } from "@repo/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"

import { getStatuses } from "~/app/[locale]/_shared/utils/status"
import { queueTableFiltersAtom } from "../_atoms/queue-table-filter-atom"

export function TableFilters() {
  const t = useI18n()

  const [filters, setFilters] = useAtom(queueTableFiltersAtom)

  const statusOptions = useMemo(
    () =>
      Object.entries(getStatuses(t))
        .map(([statusId, status]) => ({
          value: statusId,
          label: status.text
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [t]
  )

  const handleSelectStatus = (newValue: string) => {
    if (!newValue) return

    setFilters((prev) => ({
      ...prev,
      status: newValue as Doc<"appointments">["status"]
    }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: String(e.target.value) }))
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-3 size-4 text-muted-foreground" />

        <Input
          type="search"
          placeholder={t("form.placeholders.search", {
            field: t("form.labels.appointment").toLowerCase()
          })}
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          value={filters.search}
          onChange={handleSearch}
        />
      </div>

      <Select onValueChange={handleSelectStatus} defaultValue={filters.status}>
        <SelectTrigger className="font-normal text-muted-foreground sm:w-[300px] md:w-[200px] lg:w-[300px]">
          <SelectValue placeholder={t("form.labels.status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
