# Task: Convert BarbellCalculator Styles to Tailwind CSS

## Commit 1: feat: Setup Tailwind and Initial Conversion of BarbellCalculator

**Description:**
Install and configure Tailwind CSS in the project if not already present. Begin converting the `brutalistStyles` object and inline styles within `app/(main)/calculator/_components/barbell-calculator.tsx` to Tailwind CSS classes. Focus on the main container, header, and form elements. Add basic logging for component mount and style application.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx` (assuming a test file is created or exists)
    - **Expected Outcome:** Assert that the main component renders without crashing and that key elements (container, header) have the expected initial Tailwind classes applied.
2.  **Logging Check:**
    - **Action:** Load the BarbellCalculator page in the browser.
    - **Expected Log:** `INFO: BarbellCalculator mounted`, `DEBUG: Tailwind styles applied to container`.
    - **Toggle Mechanism:** `LOG_LEVEL=debug` (via environment variable or a simple console log toggle).

---

## Commit 2: feat: Convert Form, Button, and Radio Group Styles

**Description:**
Continue converting styles in `app/(main)/calculator/_components/barbell-calculator.tsx`. Focus on the form groups, input fields, buttons, and radio button group styling. Ensure responsiveness and adherence to the brutalist aesthetic defined in `docs/PRD.md`. Update logging for these specific sections.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx`
    - **Expected Outcome:** Assert that form inputs, buttons, and radio groups render correctly with Tailwind classes. Test interaction states (e.g., button active, radio checked) if possible.
2.  **Logging Check:**
    - **Action:** Interact with the form elements on the BarbellCalculator page.
    - **Expected Log:** `DEBUG: Form input styles applied`, `DEBUG: Button styles applied`, `DEBUG: Radio group styles applied`.
    - **Toggle Mechanism:** `LOG_LEVEL=debug`.

---

## Commit 3: feat: Convert Total Weight, Barbell Graphic, and Warmup Section Styles

**Description:**
Convert the styles for the `totalWeight` display, `BarbellGraphic` component (including `Plate` component styles), and the `warmupSection` (including `WarmupSet` component styles) in `app/(main)/calculator/_components/barbell-calculator.tsx` to Tailwind CSS. Address any remaining inline styles or `brutalistStyles` object usages. Ensure the visual representation of plates and the barbell is maintained.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx`
    - **Expected Outcome:** Assert that the total weight display, barbell graphic, and warmup sets render correctly with Tailwind classes. Visual regression testing would be ideal here if set up, otherwise, focus on structural correctness.
2.  **Logging Check:**
    - **Action:** View the BarbellCalculator with various inputs to display plates and warmup sets.
    - **Expected Log:** `DEBUG: Total weight styles applied`, `DEBUG: BarbellGraphic styles applied`, `DEBUG: Plate styles applied for weight X`, `DEBUG: WarmupSet styles applied`.
    - **Toggle Mechanism:** `LOG_LEVEL=debug`.

---

## Commit 4: refactor: Remove Style Object and Global Style Tag

**Description:**
Remove the `brutalistStyles` object entirely from `app/(main)/calculator/_components/barbell-calculator.tsx`. Also, remove the global `<style>` tag that was used for page-specific CSS (e.g., `body` background, `.radio-label-checked`, `button:active`). Ensure all these styles are now handled by Tailwind CSS utilities or a dedicated global CSS file if absolutely necessary for body-level styling (though prefer Tailwind if possible).

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx`
    - **Expected Outcome:** All visual aspects of the component remain consistent with the previous version, but no inline styles or `style` prop usages related to `brutalistStyles` should exist. The global style tag specific to this component should be gone.
2.  **Logging Check:**
    - **Action:** Inspect the DOM and component code.
    - **Expected Log:** No specific logs for this, but ensure no errors and that styles are applied via Tailwind classes.
    - **Toggle Mechanism:** N/A.

---

## Commit 5: fix: Address TypeScript Errors and Linter Issues

**Description:**
Address all TypeScript `any` type errors and other linter issues present in `app/(main)/calculator/_components/barbell-calculator.tsx` that were highlighted in the initial problem description. Add appropriate types for function parameters and component props. Run Biome formatter/linter.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm typecheck && pnpm lint`
    - **Expected Outcome:** `pnpm typecheck` passes with no errors. `pnpm lint` (or `biome check --write --unsafe`) passes with no errors or auto-fixes issues.
2.  **Logging Check:**
    - **Action:** N/A (Static analysis).
    - **Expected Log:** N/A.
    - **Toggle Mechanism:** N/A.
