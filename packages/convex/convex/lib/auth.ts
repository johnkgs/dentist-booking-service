import {
  customMutation,
  customQuery
} from "convex-helpers/server/customFunctions"

import type { QueryCtx } from "../_generated/server"
import { mutation, query } from "../_generated/server"

async function getUser(ctx: QueryCtx) {
  return await ctx.auth.getUserIdentity()
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
