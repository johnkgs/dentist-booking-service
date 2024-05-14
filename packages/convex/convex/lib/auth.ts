import {
  customMutation,
  customQuery
} from "convex-helpers/server/customFunctions"

import type { QueryCtx } from "../_generated/server"
import { mutation, query } from "../_generated/server"

async function getUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) return null

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique()
}

export const queryWithAuth = customQuery(query, {
  args: {},
  input: async (ctx) => {
    const user = await getUser(ctx)
    return { ctx: { ...ctx, user }, args: {} }
  }
})

export const mutationWithAuth = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const user = await getUser(ctx)
    return { ctx: { ...ctx, user }, args: {} }
  }
})
