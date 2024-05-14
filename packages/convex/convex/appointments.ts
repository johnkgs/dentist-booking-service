import { asyncMap } from "convex-helpers"
import { filter } from "convex-helpers/server/filter"
import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"
import { isWithinInterval } from "date-fns"

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
    return await filter(ctx.db.query("users"), (user) =>
      args.search
        ? !!user.name
            .toLocaleLowerCase()
            .includes(args.search.toLocaleLowerCase())
        : true
    )
      .order("desc")
      .paginate(args.paginationOpts)
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
        isWithinInterval(appointment._creationTime, {
          start: startDate,
          end: endDate
        }) && doctorIds.includes(appointment.doctorId)
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
          q.gte(q.field("_creationTime"), startDate),
          q.lte(q.field("_creationTime"), endDate)
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

export const newAppointment = mutationWithAuth({
  args: {
    room: v.string(),
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
