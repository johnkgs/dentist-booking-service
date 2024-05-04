import { getI18n } from "@repo/translation/server"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@repo/ui/alert-dialog"
import { Badge } from "@repo/ui/badge"
import { Separator } from "@repo/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

const appointments = [
  {
    id: "ID001",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID002",
    patient: "John Doe",
    status: "on_going",
    doctor: "John Doe",
    room: "Box 01",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID003",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID004",
    patient: "John Doe",
    status: "waiting",
    doctor: "John Doe",
    room: "",
    datetime: "2024-04-28T19:05:03.788Z"
  },
  {
    id: "ID005",
    patient: "John Doe",
    status: "on_going",
    doctor: "John Doe",
    room: "Box 02",
    datetime: "2024-04-28T19:05:03.788Z"
  }
] as const

const statuses = {
  on_going: { color: "red", text: "Em atendimento" },
  waiting: { color: "gray", text: "Aguardando atendimento" }
} as const

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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-neutral-900">
              {t("common.titles.appointments")}
            </h1>

            <div>
              <span className="text-lg font-medium text-neutral-900">
                {new Intl.DateTimeFormat("pt-br", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }).format(new Date())}
              </span>
            </div>
          </div>
          <Table className="rounded-md border">
            <TableHeader className="rounded-t-md">
              <TableRow>
                <TableHead>{t("form.labels.id")}</TableHead>
                <TableHead>{t("form.labels.name")}</TableHead>
                <TableHead>{t("form.labels.appointment")}</TableHead>
                <TableHead>{t("form.labels.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((id) => (
                <TableRow key={id.id} className="odd:bg-muted/20">
                  <TableCell className="font-medium">{id.id}</TableCell>
                  <TableCell>{id.patient}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("pt-br", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }).format(new Date(id.datetime))}
                  </TableCell>

                  <TableCell>
                    <Badge colorScheme={statuses[id.status].color}>
                      {statuses[id.status].text}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className="flex flex-col gap-6">
          <h1 className="text-lg font-medium text-neutral-900">
            {t("common.titles.last_calls")}
          </h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("form.labels.id")}</TableHead>
                <TableHead>{t("form.labels.name")}</TableHead>
                <TableHead>{t("form.labels.room")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...appointments]
                .filter((appointment) => appointment.status === "on_going")
                .map((id) => (
                  <TableRow key={id.id} className="odd:bg-muted/20">
                    <TableCell className="font-medium">{id.id}</TableCell>
                    <TableCell>{id.patient}</TableCell>
                    <TableCell>{id.room}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
