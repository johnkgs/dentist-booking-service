"use client"

import { useStoreUserEffect } from "../_hooks/use-sync-user"

export default function SyncUser() {
  useStoreUserEffect()
  return null
}
