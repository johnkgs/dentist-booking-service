import type { Id } from "@repo/convex/_generated/dataModel"

import { EditAppointment } from "../../../_components/edit-appointment"

interface Props {
  params: { appointmentId: Id<"appointments"> }
}

export default function Page(props: Props) {
  const { params } = props

  return (
    <div className="flex flex-auto flex-col bg-background p-4">
      <EditAppointment
        appointmentId={params.appointmentId}
        type="appointments"
      />
    </div>
  )
}
