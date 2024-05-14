import type { Translate } from "@repo/translation/server"

export const getStatuses = (t: Translate) =>
  ({
    pending: {
      color: "gray",
      text: t("common.appointment_statuses.pending")
    },
    ongoing: {
      color: "red",
      text: t("common.appointment_statuses.ongoing")
    },
    waiting: {
      color: "yellow",
      text: t("common.appointment_statuses.waiting")
    },
    finished: {
      color: "green",
      text: t("common.appointment_statuses.finished")
    }
  }) as const
