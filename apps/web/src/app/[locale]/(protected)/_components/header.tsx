"use client"

import { Fragment } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@repo/ui/breadcrumb"

import { useBreadcrumb } from "../_hooks/use-breadcrumb"
import { Notifications } from "./notifications"

export function Header() {
  const breadcrumbs = useBreadcrumb()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-neutral-100 bg-background">
      <div className="flex items-center justify-between p-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.path}>
                <BreadcrumbItem>
                  {breadcrumb.active ? (
                    <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.path}>
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-4">
          <Notifications />

          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
