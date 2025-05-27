# Task: Set up pre-commit hook for Biome to run on changed files

## Commit 1: feat: create pre-commit hook script for Biome ✅ d09847b

**Description:**
Create a pre-commit hook script at `.git/hooks/pre-commit` that runs Biome check on staged files only. The script will identify staged TypeScript, JavaScript, JSON, and React files using `git diff --cached --name-only --diff-filter=ACM`, filter for relevant file extensions (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`), and run `biome check --write` on those specific files. The script will include error handling to prevent commits when Biome finds unfixable issues and will re-stage any files that Biome automatically fixes. This aligns with the project's brutalist design philosophy of clear, functional tooling and the established Biome configuration in `biome.json` with tab indentation, 100-character line width, and comprehensive linting rules.

**Verification:**

1.  **Automated Test:**
    - **Command:** `echo "console.log('test')" > test-file.js && git add test-file.js && git commit -m "test: verify pre-commit hook" --dry-run`
    - **Expected Outcome:** `Pre-commit hook executes, runs Biome on test-file.js, applies formatting (double quotes, semicolon, tab indentation), and allows commit to proceed`
2.  **Logging Check:**
    - **Action:** `Create a deliberately malformed TypeScript file, stage it, and attempt commit`
    - **Expected Log:** `Pre-commit hook outputs: "Running Biome on staged files..." followed by file list and either "✓ All files passed Biome checks" or "✗ Biome found issues that could not be auto-fixed"`
    - **Toggle Mechanism:** `Hook script includes echo statements for each major step and can be made verbose by setting BIOME_HOOK_VERBOSE=1`

---

## Commit 2: feat: add husky for cross-platform git hook management ✅ 090a2ba

**Description:**
Install and configure Husky to manage git hooks in a cross-platform, team-friendly way. Add `husky` as a devDependency via `pnpm add -D husky`, initialize Husky with `pnpm dlx husky init`, and migrate the custom pre-commit script to `.husky/pre-commit`. Update the script to use `pnpm biome check --write` instead of direct biome calls to ensure consistent package manager usage. Configure Husky to automatically install hooks when team members run `pnpm install` by adding a `prepare` script to `package.json`. This approach ensures all developers get the same pre-commit behavior regardless of their operating system and aligns with the project's pnpm package management strategy.

**Verification:**

1.  **Automated Test:**
    - **Command:** `rm -rf .git/hooks/pre-commit && pnpm install && ls -la .husky/pre-commit && git add . && git commit -m "test: verify husky hook" --dry-run`
    - **Expected Outcome:** `Husky installs hooks during pnpm install, .husky/pre-commit exists and is executable, pre-commit hook runs via Husky and executes Biome checks`
2.  **Logging Check:**
    - **Action:** `Run pnpm install in a fresh clone and verify hook installation`
    - **Expected Log:** `pnpm install output includes "husky - Git hooks installed", .husky/pre-commit file exists with proper shebang and Biome command`
    - **Toggle Mechanism:** `Husky provides built-in logging during hook installation and execution, verbose mode available via HUSKY_DEBUG=1`

---

## Commit 3: feat: optimize hook to run Biome only on relevant file types ✅ 92b39ae

**Description:**
Enhance the pre-commit hook to be more efficient by filtering staged files to only include those that Biome can process: TypeScript (`.ts`, `.tsx`), JavaScript (`.js`, `.jsx`), JSON (`.json`), and configuration files. Update `.husky/pre-commit` to use `git diff --cached --name-only --diff-filter=ACM` to get only added, copied, or modified files, then filter using grep for relevant extensions. Add logic to skip hook execution entirely if no relevant files are staged, improving performance for commits that only touch documentation, images, or other non-code files. Include file count logging to show how many files are being processed and maintain compatibility with the project's Biome configuration that ignores `.next/`, `.wrangler/`, and `node_modules/` directories.

**Verification:**

1.  **Automated Test:**
    - **Command:** `echo "# test" > README-test.md && git add README-test.md && git commit -m "test: verify hook skips non-code files" --dry-run`
    - **Expected Outcome:** `Pre-commit hook detects no relevant files for Biome processing and exits early with success, allowing commit to proceed without running Biome`
2.  **Logging Check:**
    - **Action:** `Stage a mix of code and non-code files and attempt commit`
    - **Expected Log:** `Hook outputs "Found X files for Biome processing: file1.ts, file2.tsx" or "No files require Biome processing, skipping hook"`
    - **Toggle Mechanism:** `Hook includes file count and list output, can be made verbose with BIOME_HOOK_VERBOSE=1 environment variable`

---

## Commit 4: feat: add hook bypass mechanism and error handling ✅ 3be15b4

**Description:**
Add a bypass mechanism for the pre-commit hook using `git commit --no-verify` documentation and environment variable `SKIP_BIOME_HOOK=1`. Enhance error handling to distinguish between Biome formatting fixes (which should re-stage files and continue) and actual linting errors (which should block the commit). Update `.husky/pre-commit` to capture Biome exit codes, re-stage files that were automatically formatted, and provide clear error messages when commits are blocked. Add documentation in comments within the hook script explaining the bypass options and error scenarios. This ensures developers can override the hook when necessary (e.g., emergency fixes) while maintaining code quality standards for normal development workflow.

**Verification:**

1.  **Automated Test:**
    - **Command:** `echo "const x=1" > bad-format.js && git add bad-format.js && git commit -m "test: verify auto-fix and re-staging" && git show --name-only HEAD`
    - **Expected Outcome:** `Hook runs Biome, auto-fixes formatting to "const x = 1;", re-stages the corrected file, and allows commit to proceed with the fixed version`
2.  **Logging Check:**
    - **Action:** `Test bypass mechanism with SKIP_BIOME_HOOK=1 git commit and --no-verify flag`
    - **Expected Log:** `With bypass: "Skipping Biome pre-commit hook (SKIP_BIOME_HOOK=1)" or "Skipping pre-commit hooks (--no-verify)". Normal operation: "Re-staging auto-fixed files: bad-format.js"`
    - **Toggle Mechanism:** `Hook respects SKIP_BIOME_HOOK environment variable and git's --no-verify flag, with explicit logging for each bypass method`

---

## Commit 5: docs: document pre-commit hook setup and usage

**Description:**
Update the project README.md to document the new pre-commit hook setup, including installation instructions for new team members, bypass mechanisms, and troubleshooting guidance. Add a new section "Development Workflow" that explains how the hook integrates with the existing Biome scripts (`pnpm lint`, `pnpm format`, `pnpm check`) and the project's brutalist development philosophy of clear, functional tooling. Include examples of hook behavior with different file types, bypass options for emergency situations, and guidance on resolving hook failures. Document the relationship between the pre-commit hook and the existing Biome configuration in `biome.json`, emphasizing how this maintains code quality standards automatically while preserving developer productivity.

**Verification:**

1.  **Automated Test:**
    - **Command:** `grep -q "pre-commit" README.md && grep -q "SKIP_BIOME_HOOK" README.md && grep -q "husky" README.md`
    - **Expected Outcome:** `README.md contains documentation for pre-commit hook, bypass mechanisms, and Husky setup with proper formatting according to Biome rules`
2.  **Logging Check:**
    - **Action:** `Verify README.md includes complete documentation with examples and troubleshooting`
    - **Expected Log:** `README.md contains sections for hook installation, usage examples, bypass methods, and integration with existing Biome workflow`
    - **Toggle Mechanism:** `Direct file content verification using grep and manual review of documentation completeness and accuracy`
