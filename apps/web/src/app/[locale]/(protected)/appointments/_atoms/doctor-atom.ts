import { atom } from "jotai"

import type { Id } from "@repo/convex/_generated/dataModel"

export const doctorIdsAtom = atom<Id<"users">[]>([])
