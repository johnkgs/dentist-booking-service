import { asyncMap } from "convex-helpers"
import { filter } from "convex-helpers/server/filter"
import { v } from "convex/values"
import { matchSorter } from "match-sorter"

import { mutationWithAuth, queryWithAuth } from "./lib/auth"

export const list = queryWithAuth({
  args: {
    status: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.number(),
    page: v.number()
  },
  handler: async (ctx, args) => {
    const documents = await filter(ctx.db.query("receptionQueue"), (item) =>
      args.status ? item.status === args.status : true
    )
      .order("desc")
      .collect()

    const result = await asyncMap(documents, async (item) => ({
      ...item,
      patient: await ctx.db.get(item.patientId),
      doctor: await ctx.db.get(item.doctorId)
    }))

    return {
      pages: Math.ceil(result.length / args.limit),
      rows: matchSorter(result, args.search ?? "", {
        keys: ["patient.name", "doctor.name"]
      }).slice((args.page - 1) * args.limit, (args.page - 1 + 1) * args.limit)
    }
  }
})

export const newSchedule = mutationWithAuth({
  args: {
    appointmentId: v.id("appointments")
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId)
    if (!appointment) return

    await ctx.db.patch(args.appointmentId, { status: "waiting" })

    return await ctx.db.insert("receptionQueue", {
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      status: "waiting"
    })
  }
})

export const listAppointments = queryWithAuth({
  args: {
    search: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const appointmentDocuments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect()

    const result = await asyncMap(
      appointmentDocuments,
      async (appointment) => ({
        ...appointment,
        patient: await ctx.db.get(appointment.patientId),
        doctor: await ctx.db.get(appointment.doctorId)
      })
    )

    return matchSorter(result, args.search ?? "", {
      keys: ["patient.name", "doctor.name"]
    }).slice(0, 5)
  }
})
