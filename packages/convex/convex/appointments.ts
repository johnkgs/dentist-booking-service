import { asyncMap } from "convex-helpers"
import { filter } from "convex-helpers/server/filter"
import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"

import { isAfter, isBefore } from "@repo/shared/utils/date-fns"
import { matchSorter } from "@repo/shared/utils/match-sorter"

import { mutationWithAuth, queryWithAuth } from "./lib/auth"

export const doctorOptions = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const doctorDocuments = await ctx.db.query("users").collect()

    return doctorDocuments.map((doctor) => ({
      label: doctor.name,
      value: doctor._id
    }))
  }
})

export const patientOptions = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const patientDocuments = await ctx.db.query("patients").collect()

    return patientDocuments.map((patient) => ({
      label: patient.name,
      value: patient._id
    }))
  }
})

export const listDoctors = queryWithAuth({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("users")
      .order("desc")
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: matchSorter(results.page, args.search ?? "", {
        keys: ["name"]
      })
    }
  }
})

export const list = queryWithAuth({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    doctorIds: v.array(v.id("users"))
  },
  handler: async (ctx, { doctorIds, endDate, startDate }) => {
    if (!doctorIds.length || !startDate || !endDate) return []

    const appointmentDocuments = await filter(
      ctx.db.query("appointments"),
      (appointment) =>
        isAfter(appointment.startDate, startDate) &&
        isBefore(appointment.endDate, endDate) &&
        doctorIds.includes(appointment.doctorId)
    ).collect()

    return await asyncMap(appointmentDocuments, async (appointment) => ({
      ...appointment,
      patient: await ctx.db.get(appointment.patientId),
      doctor: await ctx.db.get(appointment.doctorId),
      showPreviewDate: appointment.diffInMinutes >= 45
    }))
  }
})

export const mine = queryWithAuth({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number())
  },
  handler: async (ctx, { endDate, startDate }) => {
    const doctorId = ctx.user?._id

    if (!doctorId || !startDate || !endDate) return []

    const appointmentDocuments = await ctx.db
      .query("appointments")
      .withIndex("by_doctor_id", (q) => q.eq("doctorId", doctorId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startDate"), startDate),
          q.lte(q.field("endDate"), endDate)
        )
      )
      .collect()

    return await asyncMap(appointmentDocuments, async (appointment) => {
      return {
        ...appointment,
        patient: await ctx.db.get(appointment.patientId),
        doctor: await ctx.db.get(appointment.doctorId),
        showPreviewDate: appointment.diffInMinutes >= 45
      }
    })
  }
})

export const get = queryWithAuth({
  args: {
    appointmentId: v.id("appointments")
  },
  handler: async (ctx, args) => {
    const appointment = await ctx.db.get(args.appointmentId)
    if (!appointment) return

    return {
      ...appointment,
      patient: await ctx.db.get(appointment.patientId),
      doctor: await ctx.db.get(appointment.doctorId)
    }
  }
})

export const newAppointment = mutationWithAuth({
  args: {
    room: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    diffInMinutes: v.number(),
    doctorId: v.id("users"),
    patientId: v.id("patients")
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      ...args,
      status: "pending"
    })
  }
})

export const editAppointment = mutationWithAuth({
  args: {
    appointmentId: v.id("appointments"),
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
  handler: async (ctx, { appointmentId, ...args }) => {
    return await ctx.db.patch(appointmentId, {
      ...args
    })
  }
})

export const removeAppointment = mutationWithAuth({
  args: {
    appointmentId: v.id("appointments")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.appointmentId)
  }
})
