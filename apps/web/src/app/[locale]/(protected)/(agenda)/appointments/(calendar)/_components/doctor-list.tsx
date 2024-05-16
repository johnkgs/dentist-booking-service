"use client"

import type { FunctionReturnType } from "convex/server"
import { useEffect, useState } from "react"
import { usePaginatedQuery } from "convex/react"
import { useAtom } from "jotai"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Checkbox } from "@repo/ui/checkbox"
import { Input } from "@repo/ui/input"

import { doctorIdsAtom } from "../../../_atoms/doctor-atom"

export function DoctorList() {
  const t = useI18n()
  const [search, setSearch] = useState("")
  const [doctorIds, setDoctorIdsAtom] = useAtom(doctorIdsAtom)
  const [data, setData] = useState<
    FunctionReturnType<typeof api.appointments.listDoctors>["page"]
  >([])

  const { results, status } = usePaginatedQuery(
    api.appointments.listDoctors,
    { search },
    { initialNumItems: 5 }
  )

  useEffect(() => {
    if (status !== "Exhausted") return
    setData(results)
  }, [status, results])

  return (
    <div className="flex flex-col gap-2 overflow-y-auto bg-background p-4">
      <Input
        placeholder={t("form.placeholders.search", {
          field: t("form.labels.doctors")
        })}
        value={search}
        onChange={(e) => setSearch(String(e.target.value))}
      />

      <h2 className="font-medium text-gray-800">
        {t("common.titles.agendas")}
      </h2>

      <div className="flex flex-col gap-1">
        {data.map((doctor) => (
          <div key={doctor._id} className="flex items-center gap-2">
            <Checkbox
              id="checkbox-1"
              colorScheme="primary"
              checked={doctorIds.includes(doctor._id)}
              onCheckedChange={(checked) => {
                if (!checked) {
                  return setDoctorIdsAtom((prev) =>
                    prev.filter((id) => id !== doctor._id)
                  )
                }
                setDoctorIdsAtom((prev) => [...prev, doctor._id])
              }}
            />
            <label
              htmlFor="checkbox-1"
              className="cursor-default text-sm text-gray-900"
            >
              Dr. {doctor.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
