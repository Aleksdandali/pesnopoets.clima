-- Revert Google Ads conversion tag id to AW-18063225430.
-- Background: migration 016 switched to AW-3120349748 expecting a GA4 link,
-- but the active campaign account (with budget + 3 live Search campaigns)
-- is AW-18063225430. Conversion data must route there or campaigns get no signal.
-- Four conversion actions (Заявка с сайта, Клик по телефону, Клик WhatsApp,
-- Клик Viber) were created in AW-18063225430 on 2026-05-15 and their labels
-- are wired in lib/gtag.ts.

UPDATE site_settings
SET value = '"AW-18063225430"'::jsonb
WHERE key = 'google_ads_id';
