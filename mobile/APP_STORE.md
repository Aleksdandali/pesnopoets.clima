# App Store / TestFlight submission checklist

Reference for filling out App Store Connect when submitting the app.
All text below is final draft — paste directly into the form fields.

---

## 1. App name (30 chars max)

**Песнопоец Клима** (18 chars) ✓

## 2. Subtitle (30 chars max)

- **BG**: Климатици • Монтаж • Сервиз
- **EN**: AC • Installation • Service

## 3. Bundle ID

`com.pesnopoetsclima.app` (matches `mobile/app.json`)

## 4. SKU (internal, any string)

`pesnopoets-clima-mobile-v1`

## 5. Primary language

Bulgarian (bg)

## 6. Category

- Primary: **Lifestyle**
- Secondary: **Utilities**

## 7. Description (4000 chars max)

### Bulgarian

```
Песнопоец Клима — официалното приложение за клиенти на сервиза за климатици във Варна. Един бутон до вашия техник, ясна история на работите и автоматичен график за профилактика.

КАКВО МОЖЕТЕ ДА ПРАВИТЕ
• Виждате всичките си климатици на едно място — марка, модел, дата на монтаж, гаранция, серийни номера и снимки.
• Получавате напомняне за годишна профилактика 2 седмици, 1 седмица и в деня на падежа.
• Заявявате профилактика с един бутон — техникът ще ви се обади за уговорка.
• Чатите директно с екипа. Извън работно време (9:00–18:00) отговаря AI асистент.
• Виждате пълната история на сервиза — какво е правено, кога и за каква цена.

ЗА КОГО Е ПРИЛОЖЕНИЕТО
Приложението е предназначено за клиенти, на които вече сме монтирали климатик. Техникът активира профила ви на място след завършване на монтажа — нямате нужда от парола.

ВХОДЪТ Е ЧРЕЗ SMS КОД
Без регистрация. Просто въведете телефонния си номер и кода от SMS.

ПОВЕЧЕ ЗА НАС
www.pesnopoets-clima.com
```

### English

```
Pesnopoets Clima — official customer app for the air-conditioning service in Varna, Bulgaria. One tap to your technician, clear work history, and automatic maintenance reminders.

WHAT YOU CAN DO
• See all your AC units in one place — brand, model, install date, warranty, serial number, photos.
• Get reminded about annual maintenance 14 days, 7 days, and on the due date.
• Request maintenance with one button — the technician will call you to schedule.
• Chat directly with the team. Outside business hours (9 AM – 6 PM) an AI assistant replies.
• View the full service history — what was done, when, and for what price.

WHO IS IT FOR
The app is built for customers whose AC we have already installed. The technician activates your profile on-site after the installation is complete — no password needed.

LOG IN WITH SMS
No registration form. Just enter your phone number and the code from the SMS.

MORE ABOUT US
www.pesnopoets-clima.com
```

## 8. Keywords (100 chars max, comma-separated, no spaces)

- **BG**: климатик,монтаж,профилактика,сервиз,Варна,гаранция,техник,AC,Daikin
- **EN**: air,conditioning,AC,Varna,Bulgaria,maintenance,install,service,HVAC

## 9. Support URL

`https://www.pesnopoets-clima.com/contact`

## 10. Marketing URL (optional)

`https://www.pesnopoets-clima.com`

## 11. Privacy Policy URL (required)

`https://www.pesnopoets-clima.com/privacy`

> If `/privacy` doesn't exist yet on the web project, create a short page covering: data we collect (phone, name, install photos), how we use it (service delivery + reminders), how to request deletion (email/phone the office). Apple WILL reject without this URL returning 200.

## 12. App Privacy — data types disclosed

Mark these in App Store Connect → App Privacy:

| Category | Type | Linked to user | Used for tracking | Purpose |
|---|---|---|---|---|
| Contact Info | Phone Number | Yes | No | App Functionality |
| Contact Info | Name | Yes | No | App Functionality |
| Identifiers | User ID | Yes | No | App Functionality |
| User Content | Photos | Yes | No | App Functionality |
| Location | Coarse Location | Yes | No | App Functionality |
| Diagnostics | Crash Data | No | No | Analytics |

No tracking. No third-party ads. No data sold.

## 13. Screenshots (required, 6.7" iPhone — 1290 × 2796)

Take 4–6 of these flows once a TestFlight build is installed:

1. Home — list of installations with brand/model/days-until-maintenance badge
2. Installation detail — hero photo + service status card
3. Chat — conversation with a sample manager reply
4. New installation form (installer view) — at least one filled section
5. Service reminder push (captured from lock screen)

Tip: use the iOS Simulator for the 6.7" device + `Cmd+S` to capture, then drag the .png into App Store Connect.

## 14. App Review Information

- **Sign-in required**: Yes
- **Demo account**: Provide a test phone the reviewer can SMS-verify, OR provide pre-set OTP via Supabase test users feature. Easiest: create a `+15555555555` test user in Supabase Auth → Phone Auth → Test Numbers with a fixed code `123456`.
- **Notes for reviewer**:
  ```
  Demo account: +15555555555 / OTP 123456 — this is a client account with one installation pre-loaded for review purposes.
  The app is intended for existing customers of our AC service in Varna. New customer onboarding happens off-app (the technician activates the profile after on-site installation).
  ```

## 15. Pricing & Availability

- **Price**: Free
- **Availability**: Bulgaria (primary). Optionally add EU/USA.
- **Distribution**: Public

## 16. Version 1.0.0 — submit notes

```
Initial release. Customer-facing app for AC service clients in Varna, Bulgaria.
- Phone OTP login
- Per-unit service history & warranty
- One-tap maintenance request
- In-app chat with optional AI fallback
- Service reminders 14/7/0 days before annual maintenance
```

---

## TestFlight pre-flight (run in this order)

1. Apple Developer account active (€99/year — owner confirmed paid).
2. App Store Connect: **My Apps → +** → New App with bundle id `com.pesnopoetsclima.app`.
3. Copy the **App Store Connect App ID** (numeric) into `mobile/eas.json` → `submit.production.ios.ascAppId`.
4. Copy your **Apple Team ID** (from developer.apple.com → Membership) into `appleTeamId`.
5. Push token: APNs key — EAS auto-creates on first build, just approve when prompted.
6. `cd mobile && eas build --profile production --platform ios` — takes 15–20 min.
7. `eas submit --profile production --platform ios --latest` — uploads to TestFlight.
8. Wait for "Processing" → "Ready to Test" in App Store Connect (5–60 min).
9. Add internal testers (your email + owner's) under TestFlight → Internal Testing → +.
10. Owner installs TestFlight on iPhone → accepts invite → tests on real device.
11. After owner's go-ahead: TestFlight → Distribution → **Submit for Review**.
12. Apple review typically 24–72h. First-time apps occasionally bounce — common reasons: missing demo account (we provide), missing privacy URL (we provide), description doesn't match features (we match).

## Asset files still missing (must add before production build)

- `mobile/assets/icon.png` — 1024 × 1024, no alpha, no rounded corners (Apple rounds automatically)
- `mobile/assets/splash.png` — 1284 × 2778, centered logo on `#0a1628` background (matches `colors.surfaceDark`)
- `mobile/assets/adaptive-icon.png` — Android, 1024 × 1024 with safe zone

Once added, reference them in `mobile/app.json` under `ios.icon`, `android.adaptiveIcon.foregroundImage`, and `splash.image`.
