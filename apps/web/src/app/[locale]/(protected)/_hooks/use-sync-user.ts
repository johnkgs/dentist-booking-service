"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import { useConvexAuth, useMutation } from "convex/react"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const { user } = useUser()

  const [userId, setUserId] = useState<Id<"users"> | null>(null)
  const storeUser = useMutation(api.users.store)

  useEffect(() => {
    if (!isAuthenticated) return
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser()
      setUserId(id)
    }
    void createUser()
    return () => setUserId(null)
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id])
  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null
  }
}
