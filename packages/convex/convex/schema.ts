import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string()
  }).index("by_token", ["tokenIdentifier"]),
  patients: defineTable({
    doctorId: v.optional(v.id("users")),
    name: v.string(),
    age: v.optional(v.number()),
    gender: v.optional(v.union(v.literal("F"), v.literal("M"))),
    phone: v.string(),
    email: v.string()
  }).index("by_doctor_id", ["doctorId"]),
  appointments: defineTable({
    doctorId: v.id("users"),
    patientId: v.id("patients"),
    startDate: v.number(),
    endDate: v.number(),
    diffInMinutes: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("waiting"),
      v.literal("ongoing"),
      v.literal("finished")
    ),
    room: v.optional(v.string())
  }).index("by_doctor_id", ["doctorId"]),
  receptionQueue: defineTable({
    appointmentId: v.id("appointments")
  }),
  notifications: defineTable({
    doctorId: v.id("users"),
    appointmentId: v.id("appointments"),
    read: v.boolean(),
    archived: v.boolean(),
    title: v.string(),
    description: v.string(),
    room: v.optional(v.string())
  })
    .index("by_doctor_id", ["doctorId"])
    .index("by_doctor_id_read", ["doctorId", "read"])
})
