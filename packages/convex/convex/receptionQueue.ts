import { asyncMap } from "convex-helpers"
import { filter } from "convex-helpers/server/filter"
import { paginationOptsValidator } from "convex/server"

import { queryWithAuth } from "./lib/auth"

export const list = queryWithAuth({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await filter(
      ctx.db.query("receptionQueue"),
      (item) => !!item._id
    )
      .order("desc")
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: await asyncMap(results.page, async (item) => ({
        ...item,
        patient: await ctx.db.get(item.patientId),
        doctor: await ctx.db.get(item.doctorId)
      }))
    }
  }
})
