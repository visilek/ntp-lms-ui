# Comprehensive Adaptive Layout System

**Date:** 2026-09-12
**Status:** Open — V2 Step 1
**Related:** All layout-heavy components

## Context

The kit currently provides flex + spacing utilities. Real page layouts (card grids, galleries, dashboards) need sizing utilities and adaptive grid.

## Proposed Direction

V2 Step 1. Full layout system:
- Sizing utilities — width, height, max-width scales
- Adaptive grid — responsive columns
- Layout patterns derived from V1 usage

## Deferral Rationale

V1 reveals the actual layout requirements of real pages. Building V2's layout system on speculative patterns risks wrong assumptions.

## V1 Workaround

Inline CSS in stories + consumer-owned layout.