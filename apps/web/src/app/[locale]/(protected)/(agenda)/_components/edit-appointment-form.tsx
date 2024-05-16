"use client"

import type { FunctionArgs, FunctionReturnType } from "convex/server"
import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { useForm } from "react-hook-form"

import type { Doc, Id } from "@repo/convex/_generated/dataModel"
import { api } from "@repo/convex/_generated/api"
import {
  differenceInMinutes,
  eachMinuteOfInterval,
  endOfDay,
  format,
  getUnixTime,
  intlFormat,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@repo/ui/form"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "@repo/ui/icons"
import { Input } from "@repo/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/select"
import { cn } from "@repo/ui/utils"

import type { AppointmentType } from "../_atoms/calendar-atom"
import type { EditAppointmentFields } from "../_validations/appointment-validation"
import { SECOND } from "~/app/[locale]/_shared/utils/constants"
import { getStatuses } from "~/app/[locale]/_shared/utils/status"
import { getEditAppointmentSchema } from "../_validations/appointment-validation"

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

interface Props {
  type: AppointmentType
  appointment: NonNullable<FunctionReturnType<typeof api.appointments.get>>
}

export function EditAppointmentForm(props: Props) {
  const { appointment, type } = props
  const t = useI18n()
  const router = useRouter()

  const form = useForm<EditAppointmentFields>({
    resolver: zodResolver(getEditAppointmentSchema(t)),
    defaultValues: useMemo(
      () => ({
        room: appointment.room,
        startDate: new Date(appointment.startDate),
        startTime: roundToNearestMinutes(appointment.startDate),
        endTime: roundToNearestMinutes(appointment.endDate),
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        status: appointment.status
      }),
      [appointment]
    )
  })
  const doctorOptions = useQuery(api.appointments.doctorOptions)
  const patientOptions = useQuery(api.appointments.patientOptions)
  const editAppointment = useMutation(api.appointments.editAppointment)

  const statusOptions = useMemo(
    () =>
      Object.entries(getStatuses(t))
        .map(([statusId, status]) => ({
          value: statusId,
          label: status.text
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [t]
  )

  async function onSubmit(values: EditAppointmentFields) {
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
      appointmentId: appointment._id,
      doctorId: values.doctorId as Id<"users">,
      patientId: values.patientId as Id<"patients">,
      room: values.room,
      status: values.status as Doc<"appointments">["status"],
      startDate: getUnixTime(startDate) * SECOND,
      endDate: getUnixTime(endDate) * SECOND,
      diffInMinutes: differenceInMinutes(endDate, startDate)
    } satisfies FunctionArgs<typeof api.appointments.editAppointment>

    await editAppointment(payload)

    form.reset()
    router.push(`/${type}`)
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid gap-4 py-4">
          <Button variant="ghost" size="icon">
            <Link href={`/${type}`}>
              <XIcon />
            </Link>
          </Button>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel className="inline-flex items-center gap-1.5">
                  {t("form.labels.status")}{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="font-normal text-muted-foreground sm:w-[300px] md:w-[200px] lg:w-[300px]">
                      <SelectValue placeholder={t("form.labels.status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                            hourOptions.find(
                              (hour) =>
                                format(field.value, "HH:mm") ===
                                format(hour.value, "HH:mm")
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

                                    format(field.value, "HH:mm") ===
                                      format(hour.value, "HH:mm")
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
                            hourOptions.find(
                              (hour) =>
                                format(field.value, "HH:mm") ===
                                format(hour.value, "HH:mm")
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
                                    format(field.value, "HH:mm") ===
                                      format(hour.value, "HH:mm")
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
              <FormItem className="flex flex-col space-y-4">
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

          {type !== "my-agenda" && (
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
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
          )}

          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={form.formState.isSubmitting}
            asChild
          >
            <Link href={`/${type}`}>{t("form.actions.cancel")}</Link>
          </Button>
          <Button type="submit" isLoading={form.formState.isSubmitting}>
            {t("form.actions.save")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
