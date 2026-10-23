/**
 * Returns true when the code is running in a development build.
 *
 * Centralizes the dev-mode check so the underlying mechanism can change
 * (e.g., swapping bundlers, adopting a different env convention) without
 * touching every call site.
 *
 * Vite replaces `import.meta.env.DEV` with a literal boolean at build time.
 */
export function isDev(): boolean {
  return import.meta.env.DEV
}

/**
 * Creates a scoped dev warner.
 *
 * In development, the returned function logs messages prefixed with `scope`.
 * In production, it is a no-op — no `isDev()` check per call, no logging.
 *
 * ```
 * const warn = createDevWarn('NtpTable/useColumnFilter')
 * warn('unhandled mode "gt"')
 * ```
 *
 * For expensive messages (large objects, `JSON.stringify`), guard with
 * `isDev()` at the call site so the message is not constructed in production:
 *
 * ```
 * if (isDev()) console.warn('[Scope]', expensiveMessage())
 * ```
 */
export function createDevWarn(scope: string): (message: string) => void {
  if (!isDev()) {
    return () => {}
  }
  return (message: string) => {
    console.warn(`[${scope}] ${message}`)
  }
}