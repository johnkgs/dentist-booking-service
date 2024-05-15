import { z } from "zod"

import type { Translate } from "@repo/translation/server"

export const getNewAppointmentSchema = (t: Translate) =>
  z.object({
    room: z.string().min(1, { message: t("form.validation_errors.required") }),
    startDate: z.date(),
    startTime: z.date(),
    endTime: z.date(),
    doctorId: z.string({
      required_error: t("form.validation_errors.required")
    }),
    patientId: z.string({
      required_error: t("form.validation_errors.required")
    })
  })

export type NewAppointmentFields = z.infer<
  ReturnType<typeof getNewAppointmentSchema>
>

export const getEditAppointmentSchema = (t: Translate) =>
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

export type EditAppointmentFields = z.infer<
  ReturnType<typeof getEditAppointmentSchema>
>
