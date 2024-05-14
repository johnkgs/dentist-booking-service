import type { Updater } from "@tanstack/react-table"

export interface Props {
  pageIndex: number
  pageCount: number
  setPageIndex: (updater: Updater<number>) => void
}

const SIBLINGS_COUNT = 1

const createPagesArray = (from: number, to: number) =>
  Array.from({ length: Math.max(to - from, 0) })
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0)

export function useTablePagination(props: Props) {
  const { pageIndex, pageCount: lastPage, setPageIndex } = props

  const handleGotoPage = (page: number) => () => setPageIndex(page)

  const currentPage = pageIndex + 1
  const previousPages = createPagesArray(
    currentPage - 1 - SIBLINGS_COUNT,
    currentPage - 1
  )

  const nextPages = createPagesArray(
    currentPage,
    Math.min(currentPage + SIBLINGS_COUNT, lastPage)
  )

  const isGreaterThanTwo = currentPage > 1 + SIBLINGS_COUNT
  const isGreaterThanThree = currentPage > 2 + SIBLINGS_COUNT

  const isLowerTwoThanMax = currentPage + SIBLINGS_COUNT < lastPage
  const isLowerThreeThanMax = currentPage + 1 + SIBLINGS_COUNT < lastPage

  return {
    handleGotoPage,
    isGreaterThanTwo,
    isGreaterThanThree,
    isLowerTwoThanMax,
    isLowerThreeThanMax,
    previousPages,
    nextPages,
    lastPage,
    currentPage
  }
}
