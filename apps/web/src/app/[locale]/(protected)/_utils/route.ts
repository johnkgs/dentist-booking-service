export const routeMap = {
  "/home": {
    title: "home.base",
    aliases: []
  },
  "/appointments": {
    title: "appointments.base",
    aliases: ["/appointments/[period]"]
  },
  "/appointments/edit/[appointmentId]": {
    title: "appointments.edit",
    aliases: []
  },
  "/my-agenda": {
    title: "my_agenda.base",
    aliases: ["/my-agenda/[period]"]
  },
  "/my-agenda/edit/[appointmentId]": {
    title: "my_agenda.edit",
    aliases: []
  },
  "/front-desk": {
    title: "front_desk.base",
    aliases: []
  }
} as const

export type RoutePaths = keyof typeof routeMap

export const replacePathname = (
  pathname = "",
  params: Record<string, string | string[]> | null
) => {
  const paramsArr = Object.entries(params ?? {})

  const result = paramsArr.reduce((asPath, [key, value]) => {
    // TODO: Arrumar para valores como array
    const regex = new RegExp(`\\b${value.toString()}\\b`, "gi")

    return asPath.replace(regex, `[${key}]`)
  }, pathname)

  return result
}

const combinePaths = (parent: string, child: string) =>
  `${parent}/${child}` as RoutePaths

export const buildPaths = (segments: string[]) =>
  segments
    .reduce<RoutePaths[]>((acc, cur, curIndex) => {
      const parent = curIndex > 1 ? acc[curIndex - 1] : ""
      const path = combinePaths(String(parent), cur)
      return [...acc, path]
    }, [])
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((path) => !!routeMap[path])
