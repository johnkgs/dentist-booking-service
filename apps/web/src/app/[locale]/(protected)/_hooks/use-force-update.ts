import { useCallback, useState } from "react"

export function useForceUpdate(): [VoidFunction, number] {
  const [forcedRenderCount, setForcedRenderCount] = useState(0)

  const forceRender = useCallback(() => {
    setForcedRenderCount(forcedRenderCount + 1)
  }, [forcedRenderCount])

  return [forceRender, forcedRenderCount]
}
