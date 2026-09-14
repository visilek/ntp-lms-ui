import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  label?: string
  ariaLabel?: string
  to?: RouteLocationRaw
  icon?: string
}