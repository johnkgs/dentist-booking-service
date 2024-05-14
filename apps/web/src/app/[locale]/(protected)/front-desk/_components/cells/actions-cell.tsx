"use client"

import type { CellContext } from "@tanstack/react-table"

import { Button } from "@repo/ui/button"
import { PencilIcon, TrashIcon } from "@repo/ui/icons"

type Props<Type, Value> = CellContext<Type, Value>

export function ActionsCell<Type, Value>(_info: Props<Type, Value>) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <PencilIcon className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:bg-red-500/90 hover:text-white"
      >
        <TrashIcon className="size-5" />
      </Button>
    </div>
  )
}
