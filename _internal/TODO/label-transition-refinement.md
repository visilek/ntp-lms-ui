# Label Transition Refinement

**Date:** 2026-08-31
**Status:** Open
**Related:** NtpMultiSelect, useInputBase

## Context

Selecting/unselecting options in NtpMultiSelect causes a brief label twitch — CSS transition + state update timing.

## Proposed Direction

Investigate a more robust sync between selection state and label float. Consider removing label position transition entirely or using JS-driven float state.

## Deferral Rationale

Current fix (refocus + 50ms delay) is acceptable for v1.