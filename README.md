# Spicy WOD - Workout Tracker

This is a [Next.js](https://nextjs.org/) workout tracking application that uses [NextAuth.js](https://next-auth.js.org/) for authentication, [Drizzle](https://orm.drizzle.team) as the ORM, and a SQLite database for data persistence. The app features a brutalist design philosophy with clear, functional interfaces.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS with brutalist design principles
- **Code Quality**: Biome for linting, formatting, and import organization
- **Deployment**: Cloudflare Pages with OpenNext

## Code Quality & Development

This project uses [Biome](https://biomejs.dev/) for unified code formatting, linting, and import organization. Biome provides fast, consistent code quality enforcement with zero configuration.

### Available Scripts

```bash
# Lint and format code (recommended for development)
pnpm lint

# Check code without making changes (dry-run)
pnpm lint:check

# Format code only
pnpm format

# Comprehensive check (lint + format + organize imports)
pnpm check
```

### Editor Integration

For the best development experience, install the Biome extension for your editor:

- **VS Code**: Install the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- **Other editors**: See [Biome editor integration guide](https://biomejs.dev/guides/integrate-in-editor/)

Configure your editor to format on save for automatic code formatting.

### Code Style Guidelines

- **No rounded edges**: Maintains brutalist design consistency
- **Tab indentation**: 4-space width for readability
- **Double quotes**: For string literals
- **Trailing commas**: Always included for cleaner diffs
- **Import organization**: Automatic sorting and type imports

### Pre-commit Hook

This project includes an automated pre-commit hook powered by [Husky](https://typicode.github.io/husky/) that runs Biome checks on staged files. The hook automatically:

- Runs only on relevant file types (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`)
- Auto-fixes formatting issues and re-stages corrected files
- Blocks commits when unfixable linting errors are found
- Skips processing when no relevant files are staged

#### Installation

The pre-commit hook is automatically installed when you run:

```bash
pnpm install
```

#### Usage Examples

```bash
# Normal commit - hook runs automatically
git commit -m "feat: add new feature"

# Hook auto-fixes formatting and allows commit
git add poorly-formatted.js
git commit -m "fix: update logic"
# Output: "Re-staging auto-fixed files: poorly-formatted.js"

# Hook skips when no code files are staged
git add README.md
git commit -m "docs: update readme"
# Output: "No files require Biome processing, skipping hook"
```

#### Bypass Options

For emergency situations or when you need to bypass the hook:

```bash
# Skip all pre-commit hooks
git commit --no-verify -m "emergency fix"

# Skip only the Biome hook
SKIP_BIOME_HOOK=1 git commit -m "skip biome check"
```

#### Troubleshooting

If the hook fails due to linting errors:

1. **Review the errors**: The hook will display specific issues found by Biome
2. **Fix manually**: Address the linting errors in your code
3. **Re-attempt commit**: Stage your fixes and commit again
4. **Use bypass if needed**: For urgent fixes, use `--no-verify` or `SKIP_BIOME_HOOK=1`

The hook integrates seamlessly with the existing Biome workflow (`pnpm lint`, `pnpm format`, `pnpm check`) and maintains the project's brutalist development philosophy of clear, functional tooling.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Set up the database:

```bash
pnpm db:apply
pnpm db:seed
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

```bash
# Apply database migrations
pnpm db:apply

# Open Drizzle Studio
pnpm db:studio

# Seed the database
pnpm db:seed
```

## Deployment

This project is configured for deployment on Cloudflare Pages:

```bash
# Build and preview locally
pnpm preview

# Deploy to production
pnpm deploy:prod
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Biome Documentation](https://biomejs.dev/) - learn about code quality tools
- [Drizzle ORM](https://orm.drizzle.team) - learn about the database ORM
- [Cloudflare Pages](https://pages.cloudflare.com/) - learn about deployment platform
