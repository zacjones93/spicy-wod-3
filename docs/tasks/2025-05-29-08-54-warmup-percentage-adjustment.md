# Task: Adjustable Warmup Percentages with Cookie Persistence

## Commit 1: feat: Add UI elements for displaying and adjusting warmup percentages

**Description:**
Modify `app/(main)/calculator/_components/barbell-calculator.tsx` to:

- Display the current percentage for each warmup set next to the set information.
- Add input fields (e.g., number input or slider) for each warmup set to allow users to adjust the percentage.
- The initial percentages will be the current default values: `[0.4, 0.55, 0.7, 0.8, 0.9]`.
- Update the `WarmupSet` component to accept and display the percentage.
- Update the main `BarbellCalculator` component to manage the state of these percentages.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx` (A new test file `barbell-calculator.test.tsx` will need to be created if it doesn't exist, focusing on rendering the new percentage inputs and displays).
    - **Expected Outcome:** Assert that input fields for percentages are rendered for each warmup set and that the displayed default percentages are correct.
2.  **Logging Check:**
    - **Action:** Manually change a percentage in the UI.
    - **Expected Log:** `console.log("INFO: Warmup percentage for set X changed to Y")` in the browser console.
    - **Toggle Mechanism:** Standard browser developer tools console.

---

## Commit 2: feat: Implement logic for dynamic warmup calculation based on adjustable percentages

**Description:**
In `app/(main)/calculator/_components/barbell-calculator.tsx`:

- Modify the `warmupSets` useMemo hook.
- Instead of using the hardcoded `WARMUP_PERCENTAGES` constant directly, use the state that holds the user-adjustable percentages.
- Ensure that when a percentage is changed, the corresponding warmup set's weight and plates are recalculated and the UI updates.
- Add validation to percentage inputs (e.g., ensure they are within a reasonable range like 0-100%).

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx`
    - **Expected Outcome:** Test that changing a percentage input correctly updates the calculated weight and plates for that warmup set. Test edge cases for percentage inputs (min/max values).
2.  **Logging Check:**
    - **Action:** Adjust a warmup percentage.
    - **Expected Log:** `console.log("DEBUG: Recalculating warmup set X with new percentage P, old weight OW, new weight NW")`.
    - **Toggle Mechanism:** Standard browser developer tools console.

---

## Commit 3: feat: Persist adjustable warmup percentages to cookies

**Description:**

- Utilize a library like `js-cookie` or browser's native `document.cookie` API to store the array of warmup percentages.
- In `app/(main)/calculator/_components/barbell-calculator.tsx`:
  - On component mount, attempt to read the saved percentages from cookies. If found, use them to initialize the percentage state, overriding the defaults.
  - Whenever the user adjusts a percentage, save the entire array of current percentages to cookies.
  - Choose an appropriate cookie name (e.g., `warmupPercentages`).
  - Ensure cookie persistence is handled gracefully (e.g. what if cookies are disabled).

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test --filter barbell-calculator.test.tsx`
    - **Expected Outcome:** Mock `document.cookie`. Test that percentages are saved to cookies when changed. Test that percentages are loaded from cookies on component mount if they exist.
2.  **Logging Check:**
    - **Action:** Adjust percentages, close and reopen the calculator page (or refresh).
    - **Expected Log:**
      - On change: `console.log("INFO: Warmup percentages saved to cookie:", percentagesArray)`
      - On load: `console.log("INFO: Loaded warmup percentages from cookie:", percentagesArray)` or `console.log("INFO: No warmup percentages found in cookie, using defaults.")`
    - **Toggle Mechanism:** Standard browser developer tools console. Check Application > Cookies in browser dev tools.

---

## Commit 4: chore: Add `js-cookie` dependency and update types

**Description:**

- If `js-cookie` is chosen for cookie management:
  - Add `js-cookie` and `@types/js-cookie` (if using TypeScript) to `package.json` using `pnpm add js-cookie @types/js-cookie`.
  - Run `pnpm install`.
- Update any relevant type definitions if necessary.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm biome check --write --unsafe . && pnpm tsc --noEmit`
    - **Expected Outcome:** No type errors or linting issues. `js-cookie` is listed in `package.json`.
2.  **Logging Check:**
    - **Action:** Verify `pnpm install` completes without errors.
    - **Expected Log:** Terminal output from `pnpm install` shows successful installation.
    - **Toggle Mechanism:** N/A.

---

## Commit 5: test: Add comprehensive tests for warmup percentage adjustments and persistence

**Description:**

- Create/enhance `barbell-calculator.test.tsx`.
- Add comprehensive Vitest/React Testing Library tests covering:
  - Initial rendering of default percentages.
  - User input and state updates for percentages.
  - Correct recalculation of warmup sets when percentages change.
  - Saving percentages to mocked cookies.
  - Loading percentages from mocked cookies on component initialization.
  - UI updates reflecting changes in percentages and calculated values.
  - Behavior when invalid percentage values are entered.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test`
    - **Expected Outcome:** All tests related to `barbell-calculator.tsx` pass. Test coverage for the new functionality is adequate.
2.  **Logging Check:**
    - **Action:** Run the test suite.
    - **Expected Log:** Test runner output indicating all tests passing.
    - **Toggle Mechanism:** N/A.
