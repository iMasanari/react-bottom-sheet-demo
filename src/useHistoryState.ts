import { useCallback, useEffect, useState } from 'react'

export const useHistoryState = <S,>(key: string, getPath?: (state: S) => string | null): [S | null, (state: S) => void, () => void] => {
  const [state, setState] = useState<S | null>(null)

  // 初回レンダリング時、stateがhistory.stateと差がある場合にセットする
  useEffect(() => {
    const value = history.state?.[key] ?? null
    if (value !== state) {
      setState(value)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state?.[key] || null
      setState(state)
    }

    addEventListener('popstate', handlePopState)

    return () => {
      removeEventListener('popstate', handlePopState)
    }
  }, [key])

  const setStateWithHistory = useCallback((state: S) => {
    const historyState: Record<string, unknown> = {}

    if (history.state) {
      for (const [key, value] of Object.entries(history.state)) {
        // Next.js が使用する項目（`_`始まり）以外を複製
        if (!key.startsWith('_')) {
          historyState[key] = value
        }
      }
    }

    historyState[key] = state

    const path = getPath ? getPath(state) : null

    history.pushState(historyState, '', path)
    setState(state)

    // Note: 今後(React 19では)、useEffectEvent を使用するようにする
    // eslint-disable-next-line
  }, [key])

  const clearStateWithBack = () => {
    if (history.state && Object.prototype.hasOwnProperty.call(history.state, key)) {
      history.back()
    }
  }

  return [state, setStateWithHistory, clearStateWithBack]
}
