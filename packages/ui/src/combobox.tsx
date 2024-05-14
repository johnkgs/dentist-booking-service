"use client"

import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "./utils"

interface ComboboxContextValue {
  open: boolean
  onOpenChange: (value: boolean) => void
}

const ComboboxContext = React.createContext<ComboboxContextValue | undefined>(
  {} as ComboboxContextValue
)

export type ComboboxAPI = ComboboxContextValue

const Combobox = ({
  open,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof Popover>) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const context = {
    open: open ?? isOpen,
    onOpenChange: onOpenChange ?? setIsOpen
  }

  return (
    <ComboboxContext.Provider value={context}>
      <Popover {...context} {...props} />
    </ComboboxContext.Provider>
  )
}

const useCombobox = () => {
  const comboboxContext = React.useContext(ComboboxContext)

  if (!comboboxContext) {
    throw new Error("useCombobox should be used within <Combobox>")
  }

  return comboboxContext
}

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ ...props }, ref) => {
  const { open } = useCombobox()

  return (
    <PopoverTrigger ref={ref} role="combobox" aria-expanded={open} {...props} />
  )
})
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent ref={ref} className={cn("w-auto p-0", className)} {...props}>
    <Command>{children}</Command>
  </PopoverContent>
))
ComboboxContent.displayName = "ComboboxContent"

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  React.ComponentPropsWithoutRef<typeof CommandItem>
>(({ onSelect, ...props }, ref) => {
  const { onOpenChange } = useCombobox()

  return (
    <CommandItem
      ref={ref}
      onSelect={(value) => {
        if (typeof onSelect !== "function") return
        onOpenChange(false)
        onSelect(value)
      }}
      {...props}
    />
  )
})
ComboboxItem.displayName = "ComboboxItem"

const ComboboxInput = CommandInput
const ComboboxEmpty = CommandEmpty
const ComboboxGroup = CommandGroup
const ComboboxList = CommandList

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
}
