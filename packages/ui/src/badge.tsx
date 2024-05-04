import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground"
      },
      colorScheme: {
        yellow:
          "bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-500/10",
        green: "bg-green-50 text-green-600 ring-1 ring-inset ring-green-500/10",
        gray: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10",
        red: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/10"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, colorScheme, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, colorScheme }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
