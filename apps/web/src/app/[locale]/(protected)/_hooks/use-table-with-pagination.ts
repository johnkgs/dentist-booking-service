"use client"

import type {
  OnChangeFn,
  PaginationState,
  RowData,
  TableOptions
} from "@tanstack/react-table"
import type { PrimitiveAtom } from "jotai"
import { useCallback, useEffect, useMemo } from "react"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useAtom, useSetAtom } from "jotai"

type PaginationFilter = Record<"page" | "limit", number>

interface Props<Type extends RowData, FilterValue extends PaginationFilter> {
  options: Omit<TableOptions<Type>, "getCoreRowModel">
  pageCountAtom: PrimitiveAtom<number>
  filtersAtom: PrimitiveAtom<FilterValue>
  page: number
  limit: number
  totalPages: number
}

export function useTableWithPagination<
  Type extends RowData,
  FilterValue extends PaginationFilter
>(props: Props<Type, FilterValue>) {
  const {
    pageCountAtom,
    filtersAtom,
    options,
    page,
    limit,
    totalPages = 1
  } = props
  const [controlledPageCount, setControlledPageCount] = useAtom(pageCountAtom)
  const setFilters = useSetAtom(filtersAtom)
  const pagination = useMemo(
    () => ({ pageIndex: page - 1, pageSize: limit }),
    [page, limit]
  )

  const { data, state: defaultState, ...tableOptions } = options

  const handlePaginationChange: OnChangeFn<PaginationState> = useCallback(
    (paginationUpdater) => {
      if (typeof paginationUpdater !== "function") return

      const newPaginationValue = paginationUpdater(pagination)
      setFilters((prev) => ({
        ...prev,
        page: newPaginationValue.pageIndex + 1,
        limit: newPaginationValue.pageSize
      }))
    },
    [pagination, setFilters]
  )

  const table = useReactTable({
    data,
    state: { pagination, ...defaultState },
    manualPagination: true,
    pageCount: controlledPageCount,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions
  })

  const state = table.getState()
  const pageOptions = table.getPageOptions()
  const pageCount = table.getPageCount()
  const canNextPage = table.getCanNextPage()
  const canPreviousPage = table.getCanPreviousPage()

  useEffect(() => {
    setControlledPageCount(totalPages)
  }, [totalPages, setControlledPageCount])

  return {
    state,
    pageOptions,
    pageCount,
    canNextPage,
    canPreviousPage,
    ...table
  }
}
