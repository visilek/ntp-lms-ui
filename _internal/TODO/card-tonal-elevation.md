# Card Tonal Elevation

**Date:** 2026-09-12
**Status:** Open
**Related:** NtpCard

## Context

MD3 specifies tonal elevation for elevated cards — a primary-color tint overlay that intensifies with elevation. Currently our elevated cards use plain surface color.

## Proposed Direction

Apply `color-mix` overlay on elevated cards based on elevation level.

## Deferral Rationale

Current plain surface works. Tonal elevation adds dynamic color mixing complexity.