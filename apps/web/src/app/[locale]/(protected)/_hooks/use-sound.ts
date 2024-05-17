"use client"

import path from "path"
import { useEffect, useRef } from "react"

export const useSound = (source: string) => {
  const soundRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    const fullSource = path.resolve(process.cwd(), "public", source)
    soundRef.current = new Audio(fullSource)
  }, [source])

  const play = () => {
    void soundRef.current?.play()
  }

  const pause = () => {
    void soundRef.current?.pause()
  }

  return {
    play,
    pause
  }
}
