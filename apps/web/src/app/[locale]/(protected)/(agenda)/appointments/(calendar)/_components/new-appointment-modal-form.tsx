"use client"

import type { FunctionArgs } from "convex/server"
import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { fetchQuery } from "convex/nextjs"
import { useMutation, useQuery } from "convex/react"
import { useForm } from "react-hook-form"

import type { Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"
import {
  addMinutes,
  differenceInMinutes,
  eachMinuteOfInterval,
  endOfDay,
  format,
  getUnixTime,
  intlFormat,
  isEqual,
  parse,
  roundToNearestMinutes,
  startOfDay
} from "@repo/shared/utils/date-fns"
import { useI18n } from "@repo/translation/client"
import { Button } from "@repo/ui/button"
import { Calendar } from "@repo/ui/calendar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from "@repo/ui/combobox"
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
  FormLabel,
  FormMessage
} from "@repo/ui/form"
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "@repo/ui/icons"
import { Input } from "@repo/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { cn } from "@repo/ui/utils"

import type { NewAppointmentFields } from "../../../_validations/appointment-validation"
import { SECOND } from "~/app/[locale]/_shared/utils/constants"
import { getNewAppointmentSchema } from "../../../_validations/appointment-validation"

const hourDates = eachMinuteOfInterval(
  {
    start: startOfDay(new Date()),
    end: endOfDay(new Date())
  },
  { step: 15 }
)

const hourOptions = hourDates.map((hour) => ({
  value: hour.toISOString(),
  label: format(hour, "HH:mm")
}))

export function NewAppointmentModalForm() {
  const t = useI18n()
  const initialStartTime = roundToNearestMinutes(new Date(), {
    roundingMethod: "ceil",
    nearestTo: 30
  })

  const form = useForm<NewAppointmentFields>({
    resolver: zodResolver(getNewAppointmentSchema(t)),
    defaultValues: useMemo(
      () => ({
        room: "",
        startDate: new Date(),
        startTime: initialStartTime,
        endTime: addMinutes(initialStartTime, 30)
      }),
      [initialStartTime]
    )
  })
  const doctorOptions = useQuery(api.appointments.doctorOptions)
  const patientOptions = useQuery(api.appointments.patientOptions)
  const newAppointment = useMutation(api.appointments.newAppointment)
  const [open, onOpenChange] = useState(false)
  const notify = useMutation(api.notifications.notify)

  async function onSubmit(values: NewAppointmentFields) {
    const date = format(values.startDate, "yyyy-MM-dd")
    const startTime = format(values.startTime, "HH:mm")
    const endTime = format(values.endTime, "HH:mm")
    const startDate = parse(
      `${date} ${startTime}`,
      "yyyy-MM-dd HH:mm",
      new Date(),
      {
        useAdditionalWeekYearTokens: true
      }
    )
    const endDate = parse(
      `${date} ${endTime}`,
      "yyyy-MM-dd HH:mm",
      new Date(),
      {
        useAdditionalWeekYearTokens: true
      }
    )

    const payload = {
      doctorId: values.doctorId as Id<"users">,
      patientId: values.patientId as Id<"patients">,
      room: values.room,
      startDate: getUnixTime(startDate) * SECOND,
      endDate: getUnixTime(endDate) * SECOND,
      diffInMinutes: differenceInMinutes(endDate, startDate)
    } satisfies FunctionArgs<typeof api.appointments.newAppointment>

    const appointmentId = await newAppointment(payload)

    const appointment = await fetchQuery(api.appointments.get, {
      appointmentId
    })
    if (!appointment) return

    await notify({
      appointmentId,
      doctorId: values.doctorId as Id<"users">,
      title: t("common.descriptions.new_appointment", {
        name: appointment.patient?.name
      }),
      description: t("form.descriptions.schedule_full_at", {
        startDate: intlFormat(appointment.startDate, {
          weekday: "long",
          day: "2-digit",
          month: "long"
        }),
        startTime: format(appointment.startDate, "HH:mm"),
        endTime: format(appointment.endDate, "HH:mm")
      })
    })

    form.reset()

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2" />
          {t("form.labels.new_appointment")}
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
              <DialogTitle>{t("form.labels.new_appointment")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="ghost" size="md">
                              {intlFormat(field.value, {
                                weekday: "long",
                                day: "2-digit",
                                month: "long"
                              })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox>
                          <ComboboxTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="md"
                              className="justify-between"
                            >
                              {
                                hourOptions.find((hour) =>
                                  isEqual(hour.value, field.value)
                                )?.label
                              }
                              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </ComboboxTrigger>
                          <ComboboxContent>
                            <ComboboxInput placeholder="HH:mm" />
                            <ComboboxList>
                              <ComboboxGroup>
                                {hourOptions.map((hour) => (
                                  <ComboboxItem
                                    key={hour.value}
                                    value={hour.value}
                                    onSelect={(date) =>
                                      field.onChange(new Date(date))
                                    }
                                    keywords={[hour.label]}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 size-4",
                                        isEqual(field.value, hour.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {hour.label}
                                  </ComboboxItem>
                                ))}
                              </ComboboxGroup>
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <span>-</span>

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox>
                          <ComboboxTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="md"
                              className="justify-between"
                            >
                              {
                                hourOptions.find((hour) =>
                                  isEqual(hour.value, field.value)
                                )?.label
                              }
                              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </ComboboxTrigger>
                          <ComboboxContent>
                            <ComboboxInput placeholder="HH:mm" />
                            <ComboboxList>
                              <ComboboxGroup>
                                {hourOptions.map((hour) => (
                                  <ComboboxItem
                                    key={hour.value}
                                    value={hour.value}
                                    onSelect={(date) =>
                                      field.onChange(new Date(date))
                                    }
                                    keywords={[hour.label]}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 size-4",
                                        isEqual(field.value, hour.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {hour.label}
                                  </ComboboxItem>
                                ))}
                              </ComboboxGroup>
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4 px-2">
                    <FormLabel className="inline-flex items-center gap-1.5">
                      {t("form.labels.patient")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Combobox>
                        <ComboboxTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between"
                            id="patient"
                          >
                            {patientOptions?.find(
                              (patient) => patient.value === field.value
                            )?.label ??
                              t("form.placeholders.select", {
                                field: t("form.labels.patient").toLowerCase()
                              })}
                            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </ComboboxTrigger>
                        <ComboboxContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]">
                          <ComboboxInput
                            placeholder={t("form.placeholders.search", {
                              field: t("form.labels.patient").toLowerCase()
                            })}
                          />
                          <ComboboxList>
                            <ComboboxEmpty>
                              {t("form.errors.empty", {
                                field: t("form.labels.patient").toLowerCase()
                              })}
                            </ComboboxEmpty>
                            <ComboboxGroup>
                              {patientOptions?.map((patient) => (
                                <ComboboxItem
                                  key={patient.value}
                                  value={patient.value}
                                  onSelect={field.onChange}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 size-4",
                                      field.value === patient.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {patient.label}
                                </ComboboxItem>
                              ))}
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4 px-2">
                    <FormLabel className="inline-flex items-center gap-1.5">
                      {t("form.labels.doctor")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Combobox>
                        <ComboboxTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-between"
                            id="doctor"
                          >
                            {doctorOptions?.find(
                              (doctor) => doctor.value === field.value
                            )?.label ??
                              t("form.placeholders.select", {
                                field: t("form.labels.doctor").toLowerCase()
                              })}
                            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                          </Button>
                        </ComboboxTrigger>
                        <ComboboxContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]">
                          <ComboboxInput
                            placeholder={t("form.placeholders.search", {
                              field: t("form.labels.doctor").toLowerCase()
                            })}
                          />
                          <ComboboxList>
                            <ComboboxEmpty>
                              {t("form.errors.empty", {
                                field: t("form.labels.doctor").toLowerCase()
                              })}
                            </ComboboxEmpty>
                            <ComboboxGroup>
                              {doctorOptions?.map((doctor) => (
                                <ComboboxItem
                                  key={doctor.value}
                                  value={doctor.value}
                                  onSelect={field.onChange}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 size-4",
                                      field.value === doctor.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {doctor.label}
                                </ComboboxItem>
                              ))}
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4 px-2">
                    <FormLabel className="inline-flex items-center gap-1.5">
                      {t("form.labels.room")}
                    </FormLabel>

                    <FormControl>
                      <Input {...field} />
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
                  onClick={() => form.reset()}
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
