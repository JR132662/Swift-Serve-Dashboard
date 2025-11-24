"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { OperationalSuggestion } from "@/lib/suggestions"

type SuggestionMeta = {
  dismissed: boolean
  note: string
  updatedAt: number
}

type SuggestionMetaMap = Record<string, SuggestionMeta>

const STORAGE_KEY = "swiftserve.suggestionPrefs"

const safeParse = (payload: string | null): SuggestionMetaMap => {
  if (!payload) return {}
  try {
    const parsed = JSON.parse(payload) as SuggestionMetaMap
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch (err) {
    console.warn("Failed to parse suggestion prefs", err)
    return {}
  }
}

const readFromStorage = (): SuggestionMetaMap => {
  if (typeof window === "undefined") return {}
  const existing = window.localStorage.getItem(STORAGE_KEY)
  return safeParse(existing)
}

const writeToStorage = (next: SuggestionMetaMap) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function useSuggestionPanelState(suggestions: OperationalSuggestion[]) {
  const [meta, setMeta] = useState<SuggestionMetaMap>({})
  const queue = useRef<number | null>(null)

  useEffect(() => {
    setMeta(readFromStorage())
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (queue.current) window.clearTimeout(queue.current)
    queue.current = window.setTimeout(() => {
      writeToStorage(meta)
    }, 200)
    return () => {
      if (queue.current) window.clearTimeout(queue.current)
    }
  }, [meta])

  const visibleSuggestions = useMemo(
    () =>
      suggestions.filter((suggestion) => !meta[suggestion.id]?.dismissed),
    [meta, suggestions]
  )

  const dismissedSuggestions = useMemo(
    () =>
      suggestions.filter((suggestion) => meta[suggestion.id]?.dismissed),
    [meta, suggestions]
  )

  const dismissSuggestion = useCallback((id: string) => {
    setMeta((prev) => ({
      ...prev,
      [id]: {
        dismissed: true,
        note: prev[id]?.note ?? "",
        updatedAt: Date.now(),
      },
    }))
  }, [])

  const restoreSuggestion = useCallback((id: string) => {
    setMeta((prev) => ({
      ...prev,
      [id]: {
        dismissed: false,
        note: prev[id]?.note ?? "",
        updatedAt: Date.now(),
      },
    }))
  }, [])

  const updateNote = useCallback((id: string, note: string) => {
    setMeta((prev) => ({
      ...prev,
      [id]: {
        dismissed: prev[id]?.dismissed ?? false,
        note,
        updatedAt: Date.now(),
      },
    }))
  }, [])

  const getNote = useCallback((id: string) => meta[id]?.note ?? "", [meta])

  return {
    meta,
    visibleSuggestions,
    dismissedSuggestions,
    dismissSuggestion,
    restoreSuggestion,
    updateNote,
    getNote,
  }
}
