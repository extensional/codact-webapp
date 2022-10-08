# Codact Webapp

Based on Sveltekit - [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte), deployed to [Vercel](https://vercel.com).

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fsveltekit&project-name=sveltekit-vercel&repository-name=sveltekit-vercel&demo-title=SvelteKit%20%2B%20Vercel&demo-description=A%20SvelteKit%20app%20optimized%20Edge-first.&demo-url=https%3A%2F%2Fsveltekit-template.vercel.app%2F)

_Live Example: https://sveltekit-template.vercel.app_

## Developing

First install pnpm: https://pnpm.io/installation

Once you've installed dependencies with `pnpm install`, start a development server:

```
pnpm install
npx prisma generate
```

if this is the first time using the database do

```
npx prisma db push
```

```bash
# pnpm run dev --open

# ACTUALLY
pnpm build && pnpm run preview --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.
