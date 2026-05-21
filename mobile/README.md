# Pesnopoets Clima — Mobile (iOS first)

React Native client / installer / manager app for **Песнопоец Клима**.
Built on Expo SDK 52 + expo-router + Supabase Auth (phone OTP).

> Standalone npm project — **not** in npm workspaces. `cd mobile` and operate independently of the web project.

## Architecture

- **One app, three roles** (`client` / `installer` / `manager`/`admin`) — `mobile/app/_layout.tsx` reads `profiles.role` after login and routes into `(client) | (installer) | (manager)` tab group.
- **Shared Supabase backend** with the website. Existing `clients` (mig. 008) stays the CRM key by phone; new `profiles` (mig. 018) links each `auth.users` row to its CRM record.
- **Design tokens** mirror `app/globals.css` in `mobile/lib/theme.ts`.

## Prerequisites

- Node 20+
- iOS: Xcode 16, Apple Developer account (paid — already done ✅)
- Optional for cloud builds: `npm install -g eas-cli`
- Supabase project: same as web. Phone Auth **enabled**, SMS provider = Twilio.

## First run

```bash
cd mobile
cp .env.example .env
# fill EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run check-deps     # aligns Expo-managed dep versions
npm start              # opens Expo dev menu — press "i" for iOS simulator
```

## Database

Apply migration 018 first:

```bash
# from repo root
supabase db push
```

This creates `profiles`, `installations`, `conversations`, `messages`, `service_jobs`, the `installations` storage bucket, and all RLS policies + triggers.

## Assigning roles

New signups land as `role='client'`. To promote a phone to staff:

```sql
-- in Supabase SQL Editor
UPDATE profiles SET role = 'installer' WHERE phone = '+359XXXXXXXXX';
-- or 'manager', 'admin'
```

The role self-escalation trigger (`prevent_role_self_escalation`) ensures clients can't change their own role.

## Twilio SMS (required for OTP)

1. Twilio Verify Service in Supabase Dashboard → Authentication → Providers → Phone.
2. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGE_SERVICE_SID`.
3. Default country code: `+359` (Bulgaria).

## Assets to add before App Store submission

- `mobile/assets/icon.png` — 1024×1024 PNG, no alpha
- `mobile/assets/splash.png` — 1284×2778 (iPhone 6.7") works for all
- `mobile/assets/adaptive-icon.png` — Android, 1024×1024

After adding, re-enable the references in `app.json` (`icon`, `splash.image`, `android.adaptiveIcon`).

## Build for TestFlight

```bash
eas login                              # Apple ID
eas build:configure                    # one-time
eas build --platform ios --profile preview
eas submit --platform ios              # uploads to App Store Connect / TestFlight
```

Per the project decision, **distribute via TestFlight for 1–2 weeks** before public App Store release.

## Project layout

```
mobile/
├── app/                      # expo-router file-based routes
│   ├── _layout.tsx           # root: AuthProvider + role-based router
│   ├── (auth)/login.tsx      # phone OTP — phone → SMS code → verify
│   ├── (client)/             # tabs: home / chat / profile
│   ├── (installer)/          # tabs: today / new / profile
│   └── (manager)/            # tabs: inbox / jobs / profile
├── components/
│   ├── Screen.tsx            # shared SafeAreaView + header
│   ├── EmptyState.tsx
│   └── Tabs.tsx              # shared tab bar options
├── lib/
│   ├── auth-context.tsx      # session + profile + signOut
│   ├── supabase.ts           # client (AsyncStorage persistence)
│   ├── theme.ts              # design tokens (mirror web globals.css)
│   ├── i18n.ts               # bg + ru
│   └── types.ts              # mirrors migration 018 columns
├── app.json
├── eas.json
├── metro.config.js           # watchFolders includes ../lib for shared types
├── babel.config.js
├── package.json
└── tsconfig.json
```

## Sprint roadmap

- ✅ **Sprint 1** — schema, scaffold, OTP login, role routing, placeholder screens, theme.
- ✅ **Sprint 2** — Client UI: installation list, installation detail, photo viewer.
- ✅ **Sprint 3** — Installer UI: new installation form with photo capture + upload.
- ✅ **Sprint 4** — Manager UI: inbox + chat with Supabase Realtime + AI fallback.
- ✅ **Sprint 5** — Push (Expo Notifications) + reminder cron for `next_service_at`.
- ✅ **Sprint 6** — App Store icon/splash/metadata, TestFlight, App Store submit.

## Submission cheat-sheet

Full App Store metadata + step-by-step submission flow lives in **[APP_STORE.md](./APP_STORE.md)**.

Quick path to TestFlight (once icon/splash exist):

```bash
cd mobile
eas login
eas build --profile production --platform ios
eas submit --profile production --platform ios --latest
```

Then App Store Connect → TestFlight → Internal Testing → add testers.

## Backend cron jobs (Vercel)

Configured in repo-root `vercel.json`:

| Path | Schedule (UTC) | Purpose |
|---|---|---|
| `/api/sync` | every 5 h | Bittel product catalog sync (pre-existing) |
| `/api/cron/service-reminders` | 09:00 daily | Push at 14d / 7d / 0d before `next_service_at` |
| `/api/cron/cleanup-orphan-photos` | 03:00 daily | Delete installer photos with no installation row after 24h |

All cron routes are guarded by `verifyCronSecret` against `CRON_SECRET` env var.

## Manual smoke test (post-deploy)

1. Sign in as a client on TestFlight build (real device).
2. Confirm `profiles.expo_push_token IS NOT NULL` in Supabase SQL Editor.
3. Send a chat message → manager device should get a push within 5s.
4. Trigger cron manually: `curl -H "Authorization: Bearer $CRON_SECRET" https://pesnopoets-clima.com/api/cron/service-reminders` → check `notification_log` for new rows.
5. Cleanup test: upload a photo via installer but abandon form → wait 24h → confirm folder gone from `installations` bucket.
