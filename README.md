# MicroShop Production Foundation UI

React + TypeScript frontend for the Java microservices production foundation roadmap.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Lucide React icons

## Run locally

```bash
npm install
npm run dev
```

The `index.html` file is the Vite entry point. Application UI code lives in `src/`.

## Code quality

```bash
npm run lint
npm run format
npm run format:check
```

- `eslint.config.js` configures ESLint for React + TypeScript. It catches issues like unused imports, invalid hook usage, and unsafe React refresh exports.
- `.prettierrc` defines the shared formatting style for the frontend codebase.
- `.prettierignore` keeps generated files and dependencies out of formatting checks, including `node_modules`, `dist`, Vite cache, and TypeScript build info.
- `npm run lint` checks code quality without changing files.
- `npm run format` rewrites files using Prettier.
- `npm run format:check` verifies formatting for CI or review without rewriting files.
