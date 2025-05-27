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

### Pre-commit Recommendations

Run `pnpm lint` before committing to ensure code quality. Consider setting up a pre-commit hook:

```bash
# Add to .git/hooks/pre-commit
#!/bin/sh
pnpm lint:check
```

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
