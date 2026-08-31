# Conditional Event Listener Management

**Date:** 2026-08-30
**Status:** Open
**Related:** NtpMenu

## Context

NtpMenu adds document/window listeners always — even when closed.

## Proposed Direction

Add/remove listeners on `open` change.

## Deferral Rationale

Current approach works. Only matters with many menus on one page.