"use client"

import { Fragment, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns/format"
import { intlFormat } from "date-fns/intlFormat"
import { useForm } from "react-hook-form"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@repo/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@repo/ui/form"
import { CheckIcon, PlusIcon } from "@repo/ui/icons"
import { Separator } from "@repo/ui/separator"
import { cn } from "@repo/ui/utils"

import type { NewScheduleFields } from "../_validations/new-schedule-validation"
import { getNewScheduleSchema } from "../_validations/new-schedule-validation"

export function NewScheduleModalForm() {
  const t = useI18n()
  const form = useForm<NewScheduleFields>({
    resolver: zodResolver(getNewScheduleSchema(t)),
    defaultValues: useMemo(
      () => ({
        search: ""
      }),
      []
    )
  })

  const appointments = useQuery(api.receptionQueue.listAppointments, {
    search: form.watch("search")
  })
  const newSchedule = useMutation(api.receptionQueue.newSchedule)
  const [open, onOpenChange] = useState(false)

  async function onSubmit(values: NewScheduleFields) {
    await newSchedule({
      appointmentId: values.appointmentId as Id<"appointments">
    })

    form.reset()

    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          {t("form.labels.new_schedule")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>{t("form.labels.new_schedule")}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4">
                    <FormControl>
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder={t("form.placeholders.search", {
                            field: t(
                              "form.labels.scheduling"
                            ).toLocaleLowerCase()
                          })}
                          value={field.value}
                          onValueChange={field.onChange}
                        />

                        <CommandList>
                          <CommandEmpty>
                            {t("form.errors.empty", {
                              field: t(
                                "form.labels.scheduling"
                              ).toLocaleLowerCase()
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {appointments?.map((appointment, index) => (
                              <Fragment key={appointment._id}>
                                <CommandItem
                                  value={appointment._id}
                                  onSelect={(appointmentId) => {
                                    form.setValue(
                                      "appointmentId",
                                      appointmentId
                                    )
                                  }}
                                  className="items-start"
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 size-4",
                                      appointment._id ===
                                        form.watch("appointmentId")
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-[1fr_auto] gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs">
                                          {t("form.labels.date")}
                                        </span>

                                        <span className="text-sm font-medium">
                                          {intlFormat(appointment.startDate, {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long"
                                          })}
                                          &nbsp;-&nbsp;
                                          {format(
                                            appointment.startDate,
                                            "HH:mm"
                                          )}
                                          &nbsp;até&nbsp;
                                          {format(appointment.endDate, "HH:mm")}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs">
                                          {t("form.labels.patient")}
                                        </span>
                                        <span className="truncate text-sm font-medium">
                                          {appointment.patient?.name}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs">
                                          {t("form.labels.doctor")}
                                        </span>

                                        <span className="truncate text-sm font-medium">
                                          Dr. {appointment.doctor?.name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CommandItem>
                                {index !== appointments.length - 1 && (
                                  <Separator />
                                )}
                              </Fragment>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                >
                  {t("form.actions.cancel")}
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                {t("form.actions.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
