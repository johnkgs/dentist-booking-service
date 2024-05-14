"use client"

import { useMemo } from "react"
import { usePaginatedQuery } from "convex/react"
import { intlFormat } from "date-fns/intlFormat"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { PencilIcon, TrashIcon } from "@repo/ui/icons"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@repo/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

import { getStatuses } from "~/app/[locale]/_shared/utils/status"

export function QueueTable() {
  const t = useI18n()
  const statuses = useMemo(() => getStatuses(t), [t])

  const { results } = usePaginatedQuery(
    api.receptionQueue.list,
    {},
    { initialNumItems: 10 }
  )

  return (
    <div className="flex flex-col gap-4">
      <Table className="rounded-md border">
        <TableHeader className="rounded-t-md">
          <TableRow>
            <TableHead>{t("form.labels.appointment")}</TableHead>
            <TableHead>{t("form.labels.patient")}</TableHead>
            <TableHead>{t("form.labels.doctor")}</TableHead>
            <TableHead>{t("form.labels.room")}</TableHead>
            <TableHead>{t("form.labels.status")}</TableHead>
            <TableHead>{t("form.labels.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((item) => (
            <TableRow key={item._id} className="odd:bg-muted/20">
              <TableCell>
                {intlFormat(item._creationTime, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </TableCell>
              <TableCell>{item.patient?.name}</TableCell>
              <TableCell>{item.doctor?.name}</TableCell>
              <TableCell>{item.room}</TableCell>
              <TableCell>
                <Badge colorScheme={statuses[item.status].color}>
                  {statuses[item.status].text}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-500/90 hover:text-white"
                  >
                    <TrashIcon className="size-5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
