import { onScopeDispose, ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import { createDevWarn } from '@ntp-lms-ui/lib/utils' // Keep 'utils' subfolder in the imports path to avoid circular imports error

const warn = createDevWarn('composables/useDragReorder')

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVATION_DISTANCE_PX = 5
const HIT_TOLERANCE_PX = 8

const CLASS_DRAGGING = 'ntp-drag--dragging'
const CLASS_PLACEHOLDER = 'ntp-drag--placeholder'
const CLASS_INDICATOR = 'ntp-drag-indicator'
const INDICATOR_TAG = 'div'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DragRow {
    key: string | number
    el: HTMLElement
}

export interface UseDragReorderOptions {
    /**
     * The current order of keys. Read once when a drag starts.
     *
     * The consumer guarantees that the row set (both `order` and the elements
     * returned by `getRows()`) is stable from `startDrag` until the drag ends.
     * If it changes mid-drag, the composable continues with its initial
     * snapshot; the resulting `onReorder` call may not match the current data.
     */
    order: Array<string | number>

    /** Called once when a drag commits with a new order. Not called on cancel. */
    onReorder: (newOrder: Array<string | number>) => void

    /** Override for the activation threshold. Default: ACTIVATION_DISTANCE_PX. */
    activationDistance?: number
}

export interface UseDragReorderReturn {
    /**
     * Start a drag session. Called from a pointerdown handler on a drag handle.
     *
     * `getRows` is invoked exactly once, at activation time (after the pointer
     * has moved past the activation threshold). Its result is treated as a
     * snapshot for the duration of the drag.
     */
    startDrag: (
        key: string | number,
        event: PointerEvent,
        getRows: () => DragRow[],
    ) => void

    /** True while a drag session is active (post-activation). */
    isDragging: Ref<boolean>

    /** Key of the currently dragged row, or null. */
    draggedKey: Ref<string | number | null>
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal state shapes
// ─────────────────────────────────────────────────────────────────────────────

interface PendingStart {
    key: string | number
    event: PointerEvent
    getRows: () => DragRow[]
    handleEl: HTMLElement
}

interface DragSession {
    draggedKey: string | number
    order: Array<string | number>
    rows: DragRow[]
    sourceEl: HTMLElement
    cloneEl: HTMLElement
    indicatorEl: HTMLElement
    pointerId: number
    handleEl: HTMLElement
    usingCapture: boolean
    currentX: number
    currentY: number
    lastTargetEl: HTMLElement | null
    lastPosition: 'before' | 'after' | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────────────────────────

export function useDragReorder(options: UseDragReorderOptions): UseDragReorderReturn {
    const isDragging = ref(false)
    const draggedKey = ref<string | number | null>(null)

    const activationDistance = options.activationDistance ?? ACTIVATION_DISTANCE_PX

    let session: DragSession | null = null
    let pendingStart: PendingStart | null = null

    // Module-scope handler references for document listeners (fallback mode).
    let documentMoveHandler: ((e: PointerEvent) => void) | null = null
    let documentUpHandler: ((e: PointerEvent) => void) | null = null
    let documentCancelHandler: ((e: PointerEvent) => void) | null = null
    let documentKeyHandler: ((e: KeyboardEvent) => void) | null = null

    // ───────────────────────────────────────────────────────────────────────────
    // Pending phase (pointerdown received, not yet past activation threshold)
    // ───────────────────────────────────────────────────────────────────────────

    function armPendingStart(pending: PendingStart): void {
        pendingStart = pending
        pending.handleEl.addEventListener('pointermove', onPendingPointerMove)
        pending.handleEl.addEventListener('pointerup', onPendingPointerUp)
        pending.handleEl.addEventListener('pointercancel', onPendingPointerUp)
    }

    function disarmPendingStart(): void {
        if (!pendingStart) return
        pendingStart.handleEl.removeEventListener('pointermove', onPendingPointerMove)
        pendingStart.handleEl.removeEventListener('pointerup', onPendingPointerUp)
        pendingStart.handleEl.removeEventListener('pointercancel', onPendingPointerUp)
        pendingStart = null
    }

    function onPendingPointerMove(event: PointerEvent): void {
        if (!pendingStart) return
        if (event.pointerId !== pendingStart.event.pointerId) return

        const dx = event.clientX - pendingStart.event.clientX
        const dy = event.clientY - pendingStart.event.clientY

        if (Math.hypot(dx, dy) < activationDistance) return

        const pending = pendingStart
        disarmPendingStart()
        activateSession(pending)
    }

    function onPendingPointerUp(): void {
        disarmPendingStart()
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Session lifecycle
    // ───────────────────────────────────────────────────────────────────────────

    function activateSession(pending: PendingStart): void {
        const rows = pending.getRows()

        if (rows.length === 0) {
            warn('activation aborted: getRows() returned no rows')
            return
        }

        const sourceRow = rows.find((r) => r.key === pending.key)
        if (!sourceRow) {
            warn(`activation aborted: dragged key "${String(pending.key)}" not found in getRows()`)
            return
        }

        const usingCapture = attemptPointerCapture(pending.handleEl, pending.event.pointerId)

        if (!usingCapture) {
            attachDocumentListeners(pending.event.pointerId)
        }

        const cloneEl = createClone(sourceRow.el)
        const indicatorEl = createIndicator()

        sourceRow.el.classList.add(CLASS_PLACEHOLDER)

        const rect = sourceRow.el.getBoundingClientRect()
        positionClone(cloneEl, rect.left, rect.top)

        const newSession: DragSession = {
            draggedKey: pending.key,
            order: [...options.order],
            rows,
            sourceEl: sourceRow.el,
            cloneEl,
            indicatorEl,
            pointerId: pending.event.pointerId,
            handleEl: pending.handleEl,
            usingCapture,
            currentX: rect.left,
            currentY: rect.top,
            lastTargetEl: null,
            lastPosition: null,
        }

        session = newSession
        isDragging.value = true
        draggedKey.value = pending.key

        attachKeyboardListener()
    }

    function endSession(byRelease: boolean): void {
        const current = session
        if (!current) return

        // Determine the drop target before teardown.
        // Only needed if the cause is release, not escape.
        const target = byRelease
            ? findTargetRow(current.currentY, current.rows)
            : null

        // Teardown DOM.
        removeClone(current.cloneEl)
        removeIndicator(current.indicatorEl)

        if (current.usingCapture) {
            try {
                current.handleEl.releasePointerCapture(current.pointerId)
            } catch {
                // Capture may already be released; ignore.
            }
        } else {
            detachDocumentListeners()
        }

        detachKeyboardListener()

        // Clear session state before reordering so any reactive side effects
        // triggered by onReorder see a clean composable state.
        session = null
        isDragging.value = false
        draggedKey.value = null

        if (byRelease && target) {
            const newOrder = computeNewOrder(
                current.order,
                current.draggedKey,
                target.row.key,
                target.position,
            )
            options.onReorder(newOrder)
        }

        // Remove the placeholder class after Vue has re-rendered with the new
        // order, so the class does not linger on the row at its new position.
        nextTick(() => {
            current.sourceEl.classList.remove(CLASS_PLACEHOLDER)
        })
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Pointer capture (with document-listener fallback)
    // ───────────────────────────────────────────────────────────────────────────

    function attemptPointerCapture(handleEl: HTMLElement, pointerId: number): boolean {
        try {
            handleEl.setPointerCapture(pointerId)
            return true
        } catch {
            warn('setPointerCapture threw; falling back to document listeners')
            return false
        }
    }

    function attachDocumentListeners(pointerId: number): void {
        documentMoveHandler = (e: PointerEvent) => {
            if (e.pointerId === pointerId) onPointerMove(e)
        }
        documentUpHandler = (e: PointerEvent) => {
            if (e.pointerId === pointerId) onPointerUp(e)
        }
        documentCancelHandler = (e: PointerEvent) => {
            if (e.pointerId === pointerId) onPointerCancel(e)
        }

        document.addEventListener('pointermove', documentMoveHandler)
        document.addEventListener('pointerup', documentUpHandler)
        document.addEventListener('pointercancel', documentCancelHandler)
    }

    function detachDocumentListeners(): void {
        if (documentMoveHandler) document.removeEventListener('pointermove', documentMoveHandler)
        if (documentUpHandler) document.removeEventListener('pointerup', documentUpHandler)
        if (documentCancelHandler) document.removeEventListener('pointercancel', documentCancelHandler)

        documentMoveHandler = null
        documentUpHandler = null
        documentCancelHandler = null
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Pointer event handlers (active session)
    //
    // When using pointer capture, these are bound to the handle element.
    // When using the fallback, they are invoked from the document listeners.
    // ───────────────────────────────────────────────────────────────────────────

    function onPointerMove(event: PointerEvent): void {
        const current = session
        if (!current) return
        if (event.pointerId !== current.pointerId) return

        const x = event.clientX
        const y = event.clientY

        current.currentX = x
        current.currentY = y

        requestAnimationFrame(() => {
            if (session !== current) return
            positionClone(current.cloneEl, x, y)

            const target = findTargetRow(y, current.rows)

            if (!target) {
                if (current.lastTargetEl !== null) {
                    removeIndicator(current.indicatorEl)
                    current.lastTargetEl = null
                    current.lastPosition = null
                }
                return
            }

            if (target.row.el !== current.lastTargetEl || target.position !== current.lastPosition) {
                repositionIndicator(current.indicatorEl, target.row.el, target.position)
                current.lastTargetEl = target.row.el
                current.lastPosition = target.position
            }
        })
    }

    function onPointerUp(event: PointerEvent): void {
        const current = session
        if (!current) return
        if (event.pointerId !== current.pointerId) return

        current.currentX = event.clientX
        current.currentY = event.clientY

        endSession(true)
    }

    function onPointerCancel(event: PointerEvent): void {
        const current = session
        if (!current) return
        if (event.pointerId !== current.pointerId) return

        endSession(false)
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Keyboard (Escape to cancel)
    // ───────────────────────────────────────────────────────────────────────────

    function attachKeyboardListener(): void {
        documentKeyHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                endSession(false)
            }
        }
        document.addEventListener('keydown', documentKeyHandler)
    }

    function detachKeyboardListener(): void {
        if (documentKeyHandler) {
            document.removeEventListener('keydown', documentKeyHandler)
            documentKeyHandler = null
        }
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Clone management
    // ───────────────────────────────────────────────────────────────────────────

    function createClone(sourceEl: HTMLElement): HTMLElement {
        const clone = sourceEl.cloneNode(true) as HTMLElement
        const rect = sourceEl.getBoundingClientRect()

        clone.classList.add(CLASS_DRAGGING)
        Object.assign(clone.style, {
            position: 'fixed',
            left: '0',
            top: '0',
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            pointerEvents: 'none',
            margin: '0',
            zIndex: '9999',
        })

        document.body.appendChild(clone)
        return clone
    }

    function positionClone(cloneEl: HTMLElement, x: number, y: number): void {
        cloneEl.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`
    }

    function removeClone(cloneEl: HTMLElement): void {
        cloneEl.remove()
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Hit-testing
    // ───────────────────────────────────────────────────────────────────────────

    function findTargetRow(
        pointerY: number,
        rows: DragRow[],
    ): { row: DragRow, position: 'before' | 'after' } | null {
        for (const row of rows) {
            const rect = row.el.getBoundingClientRect()

            if (
                pointerY >= rect.top - HIT_TOLERANCE_PX &&
                pointerY <= rect.bottom + HIT_TOLERANCE_PX
            ) {
                const midY = rect.top + rect.height / 2
                return {
                    row,
                    position: pointerY < midY ? 'before' : 'after',
                }
            }
        }

        return null
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Indicator management
    // ───────────────────────────────────────────────────────────────────────────

    function createIndicator(): HTMLElement {
        const indicator = document.createElement(INDICATOR_TAG)
        indicator.classList.add(CLASS_INDICATOR)
        return indicator
    }

    function repositionIndicator(
        indicatorEl: HTMLElement,
        targetEl: HTMLElement,
        position: 'before' | 'after',
    ): void {
        const parent = targetEl.parentElement
        if (!parent) return

        if (position === 'before') {
            parent.insertBefore(indicatorEl, targetEl)
        } else {
            parent.insertBefore(indicatorEl, targetEl.nextSibling)
        }
    }

    function removeIndicator(indicatorEl: HTMLElement): void {
        indicatorEl.remove()
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Order computation
    // ───────────────────────────────────────────────────────────────────────────

    function computeNewOrder(
        order: Array<string | number>,
        draggedKey: string | number,
        targetKey: string | number,
        position: 'before' | 'after',
    ): Array<string | number> {
        const without = order.filter((k) => k !== draggedKey)
        const targetIndex = without.indexOf(targetKey)

        if (targetIndex === -1) {
            warn(`computeNewOrder: target key "${String(targetKey)}" not found; returning original order`)
            return [...order]
        }

        const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
        without.splice(insertIndex, 0, draggedKey)
        return without
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Public API
    // ───────────────────────────────────────────────────────────────────────────

    function startDrag(
        key: string | number,
        event: PointerEvent,
        getRows: () => DragRow[],
    ): void {
        if (typeof document === 'undefined') return

        // If a session or pending start is already active, ignore the new call.
        if (session || pendingStart) return

        const handleEl = event.currentTarget as HTMLElement | null
        if (!handleEl) return

        // Required so touch drags don't scroll the page.
        handleEl.style.touchAction = 'none'

        // Do NOT preventDefault — focus behavior is preserved.

        armPendingStart({ key, event, getRows, handleEl })

        // Note: pointer capture is attempted at activation, not here. This allows
        // the pending phase to receive pointermove events on the handle itself,
        // which is where the activation threshold is evaluated.
    }

    onScopeDispose(() => {
        if (pendingStart) disarmPendingStart()
        if (session) endSession(false)
    })

    return { startDrag, isDragging, draggedKey }
}