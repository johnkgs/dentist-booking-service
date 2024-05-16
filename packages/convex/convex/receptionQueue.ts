import { asyncMap } from "convex-helpers"
import { v } from "convex/values"

import { matchSorter } from "@repo/shared/utils/match-sorter"

import { mutationWithAuth, queryWithAuth } from "./lib/auth"

export const list = queryWithAuth({
  args: {
    status: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.number(),
    page: v.number()
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("receptionQueue")
      .order("desc")
      .collect()

    const data = await asyncMap(documents, async (item) => {
      const appointment = await ctx.db.get(item.appointmentId)
      if (!appointment) return

      return {
        ...appointment,
        receptionQueueId: item._id,
        room: appointment.status === "waiting" ? "" : appointment.room,
        patient: await ctx.db.get(appointment.patientId),
        doctor: await ctx.db.get(appointment.doctorId)
      }
    })

    const result = data.filter((item) =>
      args.status ? item?.status === args.status : true
    )

    return {
      pages: Math.ceil(result.length / args.limit),
      rows: matchSorter(result, args.search ?? "", {
        keys: ["patient.name", "doctor.name"]
      }).slice((args.page - 1) * args.limit, (args.page - 1 + 1) * args.limit)
    }
  }
})

export const monitor = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db
      .query("receptionQueue")
      .order("desc")
      .collect()

    const data = await asyncMap(documents, async (item) => {
      const appointment = await ctx.db.get(item.appointmentId)
      if (!appointment) return

      return {
        ...appointment,
        receptionQueueId: item._id,
        room: appointment.status === "ongoing" ? appointment.room : "",
        patient: await ctx.db.get(appointment.patientId)
      }
    })

    return data.filter(
      (appointment) =>
        !!appointment && !["pending", "finished"].includes(appointment.status)
    ) as NonNullable<(typeof data)[number]>[]
  }
})

export const lastCallsMonitor = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db
      .query("receptionQueue")
      .order("desc")
      .collect()

    const data = await asyncMap(documents, async (item) => {
      const appointment = await ctx.db.get(item.appointmentId)
      if (!appointment) return

      return {
        ...appointment,
        receptionQueueId: item._id,
        room: appointment.status === "ongoing" ? appointment.room : "",
        patient: await ctx.db.get(appointment.patientId)
      }
    })

    return data.filter(
      (appointment) => !!appointment && appointment.status === "ongoing"
    ) as NonNullable<(typeof data)[number]>[]
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
      appointmentId: args.appointmentId
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

export const get = queryWithAuth({
  args: {
    receptionQueueId: v.id("receptionQueue")
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.receptionQueueId)
    if (!item) return

    const appointment = await ctx.db.get(item.appointmentId)
    if (!appointment) return

    return {
      ...appointment,
      receptionQueueId: item._id,
      room: appointment.status === "waiting" ? "" : appointment.room,
      patient: await ctx.db.get(appointment.patientId)
    }
  }
})

export const editSchedule = mutationWithAuth({
  args: {
    receptionQueueId: v.id("receptionQueue"),
    room: v.optional(v.string()),
    startDate: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("waiting"),
        v.literal("ongoing"),
        v.literal("finished")
      )
    ),
    endDate: v.optional(v.number()),
    diffInMinutes: v.optional(v.number()),
    doctorId: v.optional(v.id("users")),
    patientId: v.optional(v.id("patients"))
  },
  handler: async (ctx, { receptionQueueId, ...args }) => {
    const item = await ctx.db.get(receptionQueueId)

    if (!item) return

    return await ctx.db.patch(item.appointmentId, {
      ...args
    })
  }
})

export const removeSchedule = mutationWithAuth({
  args: {
    receptionQueueId: v.id("receptionQueue")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.receptionQueueId)
  }
})
