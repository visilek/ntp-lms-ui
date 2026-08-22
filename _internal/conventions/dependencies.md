# Dependencies

## Classification

| Category | Install As | Examples |
|---|---|---|
| Runtime libraries imported by kit code | `dependencies` | markdown-it, katex, milkdown |
| Build/test/type tools | `devDependencies` | typescript, vite, vitest, @types/* |
| Libraries the consumer already has | `peerDependencies` | vue, vue-router |

## Rule

Before adding any package, ask: **"Does the published artifact need this at runtime, or is it only for our development?"**

- Runtime → `dependencies`
- Development only → `devDependencies`
- Consumer-owned → `peerDependencies`