import { z } from "zod"

import type { Translate } from "@repo/translation/server"

export const getNewScheduleSchema = (t: Translate) =>
  z.object({
    search: z.string().optional(),
    appointmentId: z.string({
      required_error: t("form.validation_errors.required")
    })
  })

export type NewScheduleFields = z.infer<ReturnType<typeof getNewScheduleSchema>>
