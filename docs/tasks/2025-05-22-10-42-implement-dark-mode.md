# Task: Implement Dark Mode with Toggle

## Commit 1: feat: Add dark mode color palette to Tailwind CSS config ✅ Verification Skipped

**Description:**
Define a dark mode color palette in `tailwind.config.ts`. This involves adding new color definitions for background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, and ring specifically for dark mode. These colors should maintain the brutalist aesthetic while ensuring good contrast and readability. The existing light mode colors will serve as a reference. We will ensure that `darkMode` is set to `["class"]` in the tailwind config, which is essential for integration with `next-themes`.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter tailwind.config.test.ts` (A new test file `tailwind.config.test.ts` will be created to verify the structure and presence of dark mode colors)
    - **Expected Outcome:** `Asserts that the Tailwind config includes the new dark mode color definitions and that the darkMode selector is 'class'.`
2.  **Logging Check:**
    - **Action:** `Inspect the generated CSS after building the project (e.g., with pnpm build).`
    - **Expected Log:** `Verify that CSS variables for dark mode colors (e.g., --dark-background, --dark-foreground) are generated and present in the output CSS file.`
    - **Toggle Mechanism:** `N/A for this commit (config change only).`

---

## Commit 2: feat: Implement dark mode toggle component ✅ Verification Skipped

**Description:**
Create a new React component, `DarkModeToggle.tsx` (e.g., in `app/components/ui/dark-mode-toggle.tsx`). This component will be a Client Component (marked with `"use client";`) that allows users to switch between light and dark modes. It will use the `useTheme` hook from the `next-themes` library to manage the theme state and update the `<html>` tag's class (e.g., to `dark`) when dark mode is selected. It should visually indicate the current mode and provide a clear way to switch (e.g., a button with an icon).

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter DarkModeToggle.test.tsx` (A new test file `DarkModeToggle.test.tsx` will be created)
    - **Expected Outcome:** `Asserts that the toggle component renders correctly, switches theme on click, and updates the html class attribute.`
2.  **Logging Check:**
    - **Action:** `Manually interact with the toggle component in a development environment.`
    - **Expected Log:** `Console logs indicating theme change (e.g., "Theme changed to dark", "Theme changed to light") will be added to the component for debugging during development. These logs will be conditional, based on a LOG_LEVEL=debug environment variable.`
    - **Toggle Mechanism:** `LOG_LEVEL=debug`

---

## Commit 3: feat: Apply dark mode styles throughout the application ✅ Verification Skipped

**Description:**
Update existing components (both Server and Client Components) and global styles (`app/globals.css`) to use the new dark mode color palette. This involves prefixing Tailwind utility classes with `dark:` where necessary (e.g., `dark:bg-dark-background`, `dark:text-dark-foreground`). Pay close attention to maintaining the brutalist design aesthetic across both modes. This includes updating styles for text, backgrounds, borders, cards, buttons, inputs, and any custom components.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test:e2e --spec ./tests/e2e/dark-mode.spec.ts` (A new E2E test file `dark-mode.spec.ts` will be created)
    - **Expected Outcome:** `Asserts that key pages and components render correctly in both light and dark modes, with appropriate color schemes and no visual regressions. Snapshots will be used to compare.`
2.  **Logging Check:**
    - **Action:** `Manually navigate through the application in both light and dark modes.`
    - **Expected Log:** `No specific logs for this step, visual verification is primary. However, ensure any existing component-level debug logs are still functional and respect the LOG_LEVEL.`
    - **Toggle Mechanism:** `LOG_LEVEL=debug` (for any existing relevant logs)

---

## Commit 4: chore: Add ThemeProvider and integrate DarkModeToggle ✅ Verification Skipped

**Description:**
Integrate the `next-themes` `

## Commit 5: test: Add comprehensive tests for dark mode functionality ✅ Verification Skipped

**Description:**
