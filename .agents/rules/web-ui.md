---
trigger: glob
globs: "**/ui/**, **/frontend/**, **/fortlio-ui/**, **/components/**, **/*.tsx"
---

# Web UI Rules & Shadcn Standard

- **STRICT SHADCN UI STANDARD**: All interactive primitives (Buttons, Inputs, Dialogs, Cards, Badges, Tabs, Dropdowns, Sheets, Tables, Sliders, Avatars, Toast) MUST come exclusively from Shadcn UI (`@/components/ui/*`).
- **No Raw Unstyled Elements**: Never use raw HTML unstyled `<button>` or ad-hoc custom dropdown/modal state machines. Always use Shadcn accessible Radix-based primitives.
- **Feature-Based Folder Structure**: Every feature MUST live in `fortlio-ui/src/features/<feature-name>/`:
  - `components/`: Feature-specific UI components.
  - `hooks/`: Feature-specific business logic & React Query / SWR hooks.
  - `api.ts`: Feature-specific API endpoints using the shared axios client.
  - `types.ts`: Feature-specific TypeScript DTOs and state interfaces.
- **Utility Helper**: Use the standard `cn()` helper (`clsx` + `tailwind-merge`) from `@/lib/utils` for dynamic class names.
- **Theming & Color Variables**: All styling must use semantic Tailwind CSS variables (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`) ensuring consistent Dark/Light mode support.
- **No Direct LocalStorage in Components**: Centralize auth token access in `AuthContext` / `useAuth` hook rather than parsing `localStorage` inside UI components.
