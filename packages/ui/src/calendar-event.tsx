"use client"

import * as React from "react"
import {
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameMonth,
  isSameYear,
  isToday,
  isWithinInterval,
  parse,
  setDefaultOptions,
  startOfDay,
  startOfWeek
} from "date-fns"
import { addDays, addWeeks, subDays, subWeeks } from "date-fns/fp"
import { ptBR } from "date-fns/locale"

import { cn } from "./utils"

setDefaultOptions({ locale: ptBR })

const DATE_VIEW_HELPERS = {
  day: {
    days: 1,
    add: addDays,
    sub: subDays,
    interval: {
      start: startOfDay,
      end: endOfDay
    }
  },
  week: {
    days: 7,
    add: addWeeks,
    sub: subWeeks,
    interval: {
      start: startOfWeek,
      end: endOfWeek
    }
  }
}

interface CalendarEventContextValue {
  view: "week" | "day"
  currentDate: Date
  activeDays: Date[]
  daysToDisplay: number
  formattedDate: string
  style: React.CSSProperties
  activePeriod: {
    start: Date
    end: Date
  }
  goToNext: () => void
  goToPrev: () => void
  goToToday: () => void
}

const CalendarEventContext = React.createContext<
  CalendarEventContextValue | undefined
>({} as CalendarEventContextValue)

type CalendarEventProps = React.PropsWithChildren<{
  view?: "week" | "day"
  initialDate?: string
}>

const CalendarEvent = React.forwardRef<HTMLDivElement, CalendarEventProps>(
  ({ view = "week", initialDate, children }, _ref) => {
    const now = new Date()
    const date = initialDate ? parse(initialDate, "yyyy-MM-dd", now) : now

    const [currentDate, setCurrentDate] = React.useState(date)
    const helper = React.useMemo(() => DATE_VIEW_HELPERS[view], [view])
    const daysToDisplay = helper.days
    const activePeriod = React.useMemo(
      () => ({
        start: helper.interval.start(currentDate),
        end: helper.interval.end(currentDate)
      }),
      [currentDate, helper]
    )

    const activeDays = React.useMemo(
      () => eachDayOfInterval(activePeriod),
      [activePeriod]
    )
    const gridTemplateColumns = React.useMemo(
      () => `repeat(${daysToDisplay}, 1fr)`,
      [daysToDisplay]
    )

    const goToNext = React.useCallback(
      () => setCurrentDate(helper.add(1)),
      [helper]
    )

    const goToPrev = React.useCallback(
      () => setCurrentDate(helper.sub(1)),
      [helper]
    )

    const goToToday = React.useCallback(() => setCurrentDate(now), [now])

    const formatDate = React.useCallback(() => {
      const dayFormat = new Intl.DateTimeFormat("pt-br", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })

      const monthYearFormat = new Intl.DateTimeFormat("pt-br", {
        month: "long",
        year: "numeric"
      })

      if (view === "day") return dayFormat.format(currentDate)

      if (isSameMonth(activePeriod.start, activePeriod.end)) {
        return monthYearFormat.format(currentDate)
      }

      const startFormat = isSameYear(activePeriod.start, activePeriod.end)
        ? "MMM"
        : "MMM yyyy"
      const formattedStart = format(activePeriod.start, startFormat)
      const formattedEnd = format(activePeriod.end, "MMM yyyy")

      return `${formattedStart} - ${formattedEnd}`
    }, [currentDate])

    return (
      <CalendarEventContext.Provider
        value={{
          view,
          formattedDate: formatDate(),
          currentDate,
          daysToDisplay,
          activeDays,
          style: {
            gridTemplateColumns
          },
          activePeriod,
          goToNext,
          goToPrev,
          goToToday
        }}
      >
        {children}
      </CalendarEventContext.Provider>
    )
  }
)
CalendarEvent.displayName = "CalendarEvent"

const useCalendarEvent = () => {
  const calendarEventContext = React.useContext(CalendarEventContext)

  if (!calendarEventContext) {
    throw new Error("useCalendarEvent should be used within <CalendarEvent>")
  }

  return calendarEventContext
}

const CalendarEventHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { activeDays, view, style } = useCalendarEvent()

  return (
    <div
      ref={ref}
      className={cn(
        "sticky top-0 z-30 flex-none bg-background shadow ring-1 ring-black/5",
        className
      )}
      {...props}
    >
      <div className="mr-px grid text-sm text-gray-500" style={style}>
        <div className="col-end-1 w-14" />
        {activeDays.map((date, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              view === "week" && "items-center justify-center"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-1 py-3">
              <span className="text-xs uppercase">
                {format(date, "eeeeee")}
              </span>
              <span
                className={cn(
                  "flex size-10 items-center justify-center text-lg text-gray-600",
                  isToday(date) && "rounded-full bg-primary text-white"
                )}
              >
                {format(date, "d")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
CalendarEventHeader.displayName = "CalendarEventHeader"

const CalendarEventBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { currentDate } = useCalendarEvent()
  const hourDates = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: endOfDay(currentDate)
  })

  return (
    <div
      ref={ref}
      className={cn("relative flex flex-auto", className)}
      {...props}
    >
      <div className="sticky left-0 z-10 w-14 flex-none bg-background ring-1 ring-black/5"></div>
      <div className="grid flex-auto grid-cols-1 grid-rows-1">
        <div className="col-start-1 col-end-2 row-start-1 grid grid-rows-[repeat(24,_minmax(3.5rem,_1fr))] divide-y divide-gray-100">
          <div className="row-end-1 h-6" />
          {hourDates.map((date, index) => (
            <div key={index}>
              <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                {format(date, "HH:mm")}
              </div>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  )
})
CalendarEventBody.displayName = "CalendarEventBody"

const CalendarEventTimeIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, _ref) => {
  const trackerElementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const HEIGHT = 56
    const SPACING = 24

    const trackerElement = trackerElementRef.current
    if (!trackerElement) return

    const tick = () => {
      const now = new Date()
      const top =
        Math.round(differenceInMinutes(now, startOfDay(now)) * (HEIGHT / 60)) +
        SPACING
      trackerElement.style.setProperty("top", `${top}px`)
    }

    tick()

    const intervalId = setInterval(tick, 1000 * 60)

    trackerElement.scrollIntoView({ block: "center" })

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      ref={trackerElementRef}
      className={cn("absolute left-[3.25rem] right-0 z-10 flex", className)}
      {...props}
    >
      <div className="-mt-1.5 size-3 rounded-full bg-primary text-right text-xs leading-5 text-white "></div>
      <div className="h-px w-full border border-dashed border-primary/30" />
    </div>
  )
})
CalendarEventTimeIndicator.displayName = "CalendarEventTimeIndicator"

const CalendarEventGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, _ref) => {
  const { daysToDisplay, style } = useCalendarEvent()
  const daysToDisplayArr = Array.from({ length: daysToDisplay })

  return (
    <div
      className={cn(
        "col-start-1 col-end-2 row-start-1 grid grid-rows-1 divide-x divide-gray-100",
        className
      )}
      style={style}
      {...props}
    >
      {daysToDisplayArr.map((_, index) => (
        <div
          key={index}
          style={{
            gridColumnStart: index + 1,
            width: index === daysToDisplayArr.length - 1 ? "2rem" : undefined
          }}
        />
      ))}
    </div>
  )
})
CalendarEventGrid.displayName = "CalendarEventGrid"

const CalendarEventAppointment = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, _ref) => {
  const { style } = useCalendarEvent()

  return (
    <ol
      className={cn(
        "col-start-1 col-end-2 row-start-1 grid grid-cols-1 grid-rows-[calc(1.5rem)_repeat(192,_minmax(0px,_1fr))_auto]",
        className
      )}
      style={style}
      {...props}
    />
  )
})
CalendarEventAppointment.displayName = "CalendarEventAppointment"

const CalendarEventAppointmentItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    startDate: Date
    endDate: Date
  }
>(({ className, startDate, endDate, ...props }, _ref) => {
  const { activePeriod } = useCalendarEvent()
  const COL_SPAN = 8
  const gridColumnStart = differenceInDays(startDate, activePeriod.start) + 1
  const gridRowStart =
    (differenceInMinutes(startDate, startOfDay(startDate)) / 60) * COL_SPAN +
    COL_SPAN / 4
  const gridRowEnd = `span ${(differenceInMinutes(endDate, startDate) / 60) * COL_SPAN}`

  if (!isWithinInterval(startDate, activePeriod)) return null

  return (
    <li
      className={cn("relative flex", className)}
      style={{ gridColumnStart, gridRowStart, gridRowEnd }}
      {...props}
    />
  )
})
CalendarEventAppointmentItem.displayName = "CalendarEventAppointment"

export {
  CalendarEvent,
  CalendarEventAppointment,
  CalendarEventAppointmentItem,
  CalendarEventBody,
  CalendarEventGrid,
  CalendarEventHeader,
  CalendarEventTimeIndicator,
  useCalendarEvent
}
