# Brooklyn Pizza PH

Customer-facing website for Brooklyn Pizza PH in Iloilo.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/brooklyn-pizza-ph run dev
```

## Build

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/brooklyn-pizza-ph run build
```

The static site output is written to `artifacts/brooklyn-pizza-ph/dist/public`.

For a Cloudflare Pages build from this repository, use the repository root as
the root directory, the build command above, and
`artifacts/brooklyn-pizza-ph/dist/public` as the build output directory.

## Business details

The address, phone number, and reported hours currently shown on the site are
based on publicly available listings. Confirm these details and replace them if
they have changed. Menu prices and ingredient descriptions are intentionally
not guessed; customers are directed to call for current information.
