import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"

import { mutationWithAuth, queryWithAuth } from "./lib/auth"

export const watch = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const doctorId = ctx.user?._id
    if (!doctorId) return
    const now = Date.now() - 1000

    return await ctx.db
      .query("notifications")
      .withIndex("by_doctor_id", (q) =>
        q.eq("doctorId", doctorId).gte("_creationTime", now)
      )
      .filter((q) => q.eq(q.field("archived"), false))
      .order("desc")
      .first()
  }
})

export const list = queryWithAuth({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
    const doctorId = ctx.user?._id!

    return await ctx.db
      .query("notifications")
      .withIndex("by_doctor_id", (q) => q.eq("doctorId", doctorId))
      .filter((q) => q.eq(q.field("archived"), false))
      .order("desc")
      .paginate(args.paginationOpts)
  }
})

export const toRead = queryWithAuth({
  args: {},
  handler: async (ctx) => {
    const doctorId = ctx.user?._id
    if (!doctorId) return 0

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_doctor_id_read", (q) =>
        q.eq("doctorId", doctorId).eq("read", false)
      )
      .filter((q) => q.eq(q.field("archived"), false))
      .collect()

    return notifications.length
  }
})

export const notify = mutationWithAuth({
  args: {
    doctorId: v.optional(v.id("users")),
    appointmentId: v.id("appointments"),
    title: v.string(),
    description: v.string()
  },
  handler: async (ctx, args) => {
    const doctorId = ctx.user?._id
    if (!doctorId) return

    await ctx.db.insert("notifications", {
      ...args,
      doctorId: args.doctorId ?? doctorId,
      read: false,
      archived: false
    })
  }
})

export const archive = mutationWithAuth({
  args: {
    notificationId: v.id("notifications")
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      archived: true
    })
  }
})

export const read = mutationWithAuth({
  args: {
    notificationId: v.id("notifications"),
    read: v.boolean()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      read: args.read
    })
  }
})
