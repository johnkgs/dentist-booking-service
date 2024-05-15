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

export const getEditScheduleSchema = (t: Translate) =>
  z.object({
    room: z.string().min(1, { message: t("form.validation_errors.required") }),
    startDate: z.date(),
    startTime: z.date(),
    endTime: z.date(),
    status: z.string(),
    doctorId: z.string({
      required_error: t("form.validation_errors.required")
    }),
    patientId: z.string({
      required_error: t("form.validation_errors.required")
    })
  })

export type EditScheduleFields = z.infer<
  ReturnType<typeof getEditScheduleSchema>
>
