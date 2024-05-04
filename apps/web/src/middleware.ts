import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { i18nMiddleware } from "@repo/translation/middleware"

const isProtectedRoute = createRouteMatcher([
  "/:locale/front-desk(.*)",
  "/:locale/home(.*)",
  "/:locale/appointments(.*)"
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()

  return i18nMiddleware(req)
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
