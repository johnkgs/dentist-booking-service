"use client"

import { flexRender } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import { useAtomValue } from "jotai"

import { api } from "@repo/convex/_generated/api"
import { useI18n } from "@repo/translation/client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@repo/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/table"

import {
  queuePageCountAtom,
  queueTableFiltersAtom
} from "../_atoms/queue-table-filter-atom"
import { queueColumns } from "../_utils/queue-columns"
import { useTablePagination } from "../../_hooks/use-table-pagination"
import { useTableWithPagination } from "../../_hooks/use-table-with-pagination"

export function QueueTable() {
  const t = useI18n()

  const filters = useAtomValue(queueTableFiltersAtom)

  const data = useQuery(api.receptionQueue.list, filters)
  const table = useTableWithPagination({
    limit: filters.limit,
    page: filters.page,
    totalPages: data?.pages ?? 1,
    pageCountAtom: queuePageCountAtom,
    filtersAtom: queueTableFiltersAtom,
    options: {
      data: data?.rows ?? [],
      columns: queueColumns,
      meta: {
        t
      }
    }
  })

  const { state, pageCount, setPageIndex } = table
  const { pageIndex } = state.pagination

  const {
    handleGotoPage,
    isGreaterThanThree,
    isGreaterThanTwo,
    isLowerThreeThanMax,
    isLowerTwoThanMax,
    nextPages,
    previousPages,
    lastPage,
    currentPage
  } = useTablePagination({
    pageCount,
    pageIndex,
    setPageIndex
  })

  return (
    <div className="flex flex-col gap-4">
      <Table className="rounded-md border">
        <TableHeader className="rounded-t-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="odd:bg-muted/20"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          {isGreaterThanTwo && (
            <>
              <PaginationItem>
                <PaginationLink onClick={handleGotoPage(0)}>1</PaginationLink>
              </PaginationItem>

              {isGreaterThanThree && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {previousPages.length > 0 && (
            <>
              {previousPages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink onClick={handleGotoPage(page - 1)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </>
          )}

          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>

          {nextPages.length > 0 && (
            <>
              {nextPages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink onClick={handleGotoPage(page - 1)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </>
          )}

          {isLowerTwoThanMax && (
            <>
              {isLowerThreeThanMax && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink onClick={handleGotoPage(lastPage - 1)}>
                  {lastPage}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
