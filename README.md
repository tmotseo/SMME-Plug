# SMME-Plug

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Supabase Realtime Database Setup

This project supports Supabase for realtime storage of:

- Admin details (`admins`)
- User registrations (`registrations`)
- Opportunities (`opportunities`)
 - Admin authentication via Supabase Auth (email/password)

### 1. Configure environment

Copy `.env.example` to `.env` and set:

```sh
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 2. Apply database schema

Requires Supabase CLI.

```sh
npm run db:supabase:link
npm run db:supabase:push
```

Migration file:

- `supabase/migrations/20260303_001_init.sql`

### 3. (Optional) Generate TypeScript database types

```sh
npm run db:supabase:types
```

### 4. Hosting deployment script

Use:

```sh
npm run deploy:build
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting provider environment variables.

### 5. Configure Admin Auth (email/password)

1. In Supabase dashboard, create an Auth user (email/password).
2. Add the same email in `public.admins` and mark it active.

Example SQL:

```sql
insert into public.admins (email, display_name, is_active)
values ('admin@example.com', 'Platform Admin', true)
on conflict (email) do update set is_active = true;
```

The app signs in with Supabase Auth, then verifies the signed-in email exists in `public.admins` as active.
