import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { i18nMiddleware } from "@repo/translation/middleware"

const isProtectedRoute = createRouteMatcher(["/:locale/home(.*)"])

const isAttendantRoute = createRouteMatcher([
  "/:locale/front-desk(.*)",
  "/:locale/appointments(.*)"
])

const isDoctorRoute = createRouteMatcher(["/:locale/my-agenda(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isAttendantRoute(req)) {
    auth().protect((has) => has({ permission: "org:reception:manage" }), {
      unauthorizedUrl: new URL("/home", req.url).toString()
    })
  }
  if (isDoctorRoute(req)) {
    auth().protect((has) => has({ permission: "org:patient:manage" }), {
      unauthorizedUrl: new URL("/home", req.url).toString()
    })
  }
  if (isProtectedRoute(req)) auth().protect()

  return i18nMiddleware(req)
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
