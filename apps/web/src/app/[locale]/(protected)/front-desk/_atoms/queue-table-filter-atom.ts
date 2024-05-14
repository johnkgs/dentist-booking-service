import { atom } from "jotai"

import type { Doc } from "@repo/convex/_generated/dataModel"

interface QueueTableFilters {
  status?: Doc<"appointments">["status"]
  search?: string
  limit: number
  page: number
}

export const queueTableFiltersAtom = atom<QueueTableFilters>({
  page: 1,
  limit: 1
})
export const queuePageCountAtom = atom(0)
