import './BottomSheet.css'

import { css } from 'molcss'
import { MouseEvent, ReactNode, useEffect, useRef } from 'react'

const dialogStyle = css`
  overflow-y: scroll;
  overscroll-behavior: none;
  scroll-snap-type: y mandatory;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  padding: 80px 0 0;
  margin: 0;
  border: 0 none;
  background-color: transparent;

  /* スクロールバー非表示 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* スクロール用領域確保 */
  &::before {
    content: '';
    display: block;
    height: 100%;
    scroll-snap-align: end;
    pointer-events: none;
  }

  &::backdrop {
    background-color: var(--backdrop-color, rgba(0 0 0 / 0.7));

    @media not (prefers-reduced-motion) {
      animation: bottomsheet-backdrop-open 200ms ease-out;
    }
  }

  &[data-bottomsheet-state=close]::backdrop {
    background-color: transparent;
    transition: background-color 200ms ease-out;
  }

  html:has(&[open]) {
    overflow: hidden;
    padding-right: var(--scrollbar-padding);
  }
`

const dialogSheetWrapperStyle = css`
  scroll-snap-align: end;
  height: 100%;
`

const dialogSheetStyle = css`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 24px;
  border-radius: 16px 16px 0 0;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0 0 0 / 0.1);
  transition: transform 200ms ease-out;

  dialog[open] & {
    @media not (prefers-reduced-motion) {
      animation: bottomsheet-open 200ms ease-out;
    }
  }

  dialog[data-bottomsheet-state=close] & {
    transform: translateY(100%);
  }

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    right: 0;
    left: 0;
    display: block;
    width: 50px;
    height: 4px;
    border-radius: 2px;
    background-color: #ddd;
    margin: auto;
  }
`

const dialogContentStyle = css`
  overflow-y: auto;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
  border-top: 1px solid #ddd;
`

interface Props {
  open: boolean
  onRequestClose: () => void
  children: ReactNode
}

export default function BottomSheet({ open, onRequestClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogSheetWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // React の autofocus バグ対応
    // https://github.com/facebook/react/issues/23301#issuecomment-1915324737
    dialogRef.current?.setAttribute('autofocus', '')
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      const documentElement = document.documentElement
      const currentPadding = parseFloat(getComputedStyle(documentElement).paddingRight)
      const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth + currentPadding)

      if (!dialog.open) {
        dialog.showModal()
      }

      documentElement.style.setProperty('--scrollbar-padding', `${scrollbarWidth}px`)
      dialog.dataset.bottomsheetState = 'open'

      dialogSheetWrapperRef.current?.scrollIntoView(false)

      const handleId = requestAnimationFrame(() =>
        delete dialog.dataset.bottomsheetState
      )

      return () => {
        documentElement.style.removeProperty('--scrollbar-padding')
        dialog.style.removeProperty('--backdrop-color')
        cancelAnimationFrame(handleId)
      }
    } else {
      dialog.close()
    }
  }, [open])

  const requestAnimatedClose = () => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (matchMedia('(prefers-reduced-motion)').matches) {
      // アニメーションなしに閉じる
      dialog.close()
    } else {
      // 閉じるアニメーション開始
      dialog.dataset.bottomsheetState = 'close'
    }
  }

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDialogElement>) => {
    // 閉じるアニメーション終了時
    if (e.propertyName === 'transform') {
      const dialog = e.currentTarget

      dialog.close()
      delete dialog.dataset.bottomsheetState
    }
  }

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      requestAnimatedClose()
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDialogElement>) => {
    const dialog = e.currentTarget
    const height = dialogSheetWrapperRef.current?.getBoundingClientRect().height ?? dialog.scrollTop
    const opacity = 0.7 * Math.min(dialog.scrollTop / height, 1)

    dialog.style.setProperty('--backdrop-color', `rgba(0 0 0 / ${opacity.toFixed(2)})`)

    if (dialog.scrollTop < 9 && dialog.dataset.bottomsheetState !== 'open') {
      dialog.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={dialogStyle}
      onClose={onRequestClose}
      onClick={handleBackdropClick}
      onScroll={handleScroll}
      onCancel={e => {
        e.preventDefault()
        requestAnimatedClose()
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={dialogSheetWrapperRef} className={dialogSheetWrapperStyle} onClick={handleBackdropClick}>
        <div className={dialogSheetStyle}>
          <div className={dialogContentStyle}>
            {children}
          </div>
        </div>
      </div>
    </dialog>
  )
}
