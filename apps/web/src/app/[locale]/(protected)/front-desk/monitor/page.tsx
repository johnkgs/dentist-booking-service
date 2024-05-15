import { getI18n } from "@repo/translation/server"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@repo/ui/alert-dialog"
import { Separator } from "@repo/ui/separator"

import { Appointments } from "./_components/appointments"
import { LastCallsAppointments } from "./_components/last-calls-appointments"

export default async function Page() {
  const t = await getI18n()

  return (
    <div className="rounded-lg bg-background p-4">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {t("form.labels.name")}: John Doe
            </AlertDialogTitle>
            <AlertDialogDescription className="text-md text-gray-500">
              {t("form.descriptions.please_go_to_room", { room: "Box 01" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-6">
        <Appointments />

        <Separator />

        <LastCallsAppointments />
      </div>
    </div>
  )
}
