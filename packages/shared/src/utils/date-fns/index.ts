import type { FormatOptions } from "date-fns"
import { format as formatDate, isValid } from "date-fns"

export {
  addMinutes,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  endOfDay,
  endOfWeek,
  format,
  getUnixTime,
  intlFormat,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  isWithinInterval,
  parse,
  roundToNearestMinutes,
  setDefaultOptions,
  startOfDay,
  startOfWeek
} from "date-fns"

type SafeFormat = (
  date: Date | string | number | null,
  format: string,
  options?: FormatOptions
) => string | undefined

export const safeFormat: SafeFormat = (date, format, options) => {
  if (!date || !isValid(new Date(date))) return
  return formatDate(new Date(date), format, options)
}
