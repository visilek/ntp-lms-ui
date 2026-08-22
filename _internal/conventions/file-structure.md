# File Structure

- One component per folder.
- Folder name matches component name.
- Barrel `index.ts` per category, re-exported from root `index.ts`.
- Component families (e.g., NtpCard + subcomponents) share one folder.
- Component CSS in separate file: `Component.vue` + `Component.css`.