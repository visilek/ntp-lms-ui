import type { MenuPlacement, PositionStyle } from '@ntp-lms-ui/lib'

const VIEWPORT_MARGIN = 8
const ANCHOR_GAP = 4

export function computePosition(
  anchorRect: DOMRect,
  menuRect: DOMRect,
  placement: MenuPlacement,
  viewportWidth: number,
  viewportHeight: number,
): PositionStyle {
  let top = 0
  let left = 0

  switch (placement) {
    case 'bottom-end':
      top = anchorRect.bottom + ANCHOR_GAP
      left = anchorRect.right - menuRect.width
      break
    case 'bottom-start':
      top = anchorRect.bottom + ANCHOR_GAP
      left = anchorRect.left
      break
    case 'top-end':
      top = anchorRect.top - menuRect.height - ANCHOR_GAP
      left = anchorRect.right - menuRect.width
      break
    case 'top-start':
      top = anchorRect.top - menuRect.height - ANCHOR_GAP
      left = anchorRect.left
      break
  }

  const maxLeft = viewportWidth - menuRect.width - VIEWPORT_MARGIN
  const maxTop = viewportHeight - menuRect.height - VIEWPORT_MARGIN

  left = Math.max(VIEWPORT_MARGIN, Math.min(left, maxLeft))
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop))

  return {
    top: `${top}px`,
    left: `${left}px`,
  }
}