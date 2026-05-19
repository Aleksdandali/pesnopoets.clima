"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
} from "lucide-react";
import { trackInquirySubmit } from "@/lib/gtag";

type Locale = "bg" | "en" | "ru" | "ua";

interface B2BFormCopy {
  title: string;
  subtitle: string;
  fields: {
    company: string;
    eik: string;
    contact: string;
    phone: string;
    email: string;
    units: string;
    unitType: string;
    unitTypePlaceholder: string;
    address: string;
    tier: string;
    surveyTime: string;
    notes: string;
    notesPlaceholder: string;
  };
  tiers: { basic: string; standard: string; pro: string };
  submit: string;
  submitting: string;
  success: string;
  successMessage: string;
  successNext: string;
  errorMessage: string;
  required: string;
  privacy: string;
  reassurance: string;
  sendAnother: string;
}

interface Props {
  locale: Locale;
  copy: B2BFormCopy;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function B2BContractForm({ locale, copy }: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tier, setTier] = useState<"basic" | "standard" | "pro">("standard");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const company = (form.get("company") as string)?.trim() || "";
    const eik = (form.get("eik") as string)?.trim() || "";
    const contact = (form.get("contact") as string)?.trim() || "";
    const rawPhone = (form.get("phone") as string)?.trim() || "";
    const email = (form.get("email") as string)?.trim() || "";
    const units = (form.get("units") as string)?.trim() || "";
    const unitType = (form.get("unitType") as string)?.trim() || "";
    const address = (form.get("address") as string)?.trim() || "";
    const surveyTime = (form.get("surveyTime") as string)?.trim() || "";
    const notes = (form.get("notes") as string)?.trim() || "";

    const newErrors: Record<string, string> = {};
    if (!company) newErrors.company = copy.required;
    if (!contact) newErrors.contact = copy.required;
    if (!rawPhone) newErrors.phone = copy.required;
    if (!units) newErrors.units = copy.required;
    if (!address) newErrors.address = copy.required;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Bundle B2B fields into the inquiry message body.
    // Existing /api/inquiry only persists name/phone/email/message — no schema change.
    const tierLabel = copy.tiers[tier];
    const message = [
      `[B2B КОНТРАКТ — ${tierLabel.toUpperCase()}]`,
      `Компания: ${company}`,
      eik ? `ЕИК / ДДС №: ${eik}` : null,
      `Контактно лице: ${contact}`,
      `Брой апарати: ${units}`,
      unitType ? `Тип апарати: ${unitType}` : null,
      `Адрес / обект(и): ${address}`,
      `Желан тариф: ${tierLabel}`,
      surveyTime ? `Удобно за оглед: ${surveyTime}` : null,
      notes ? `Допълнително: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const data = {
      name: `${contact} (${company})`,
      phone: `+359 ${rawPhone}`.trim(),
      email: email || undefined,
      message,
      locale,
      source: "b2b-contract",
    };

    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      trackInquirySubmit("b2b-contract-form");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10 px-4 sm:px-6">
        <CheckCircle2
          className="w-14 h-14 sm:w-16 sm:h-16 text-success mx-auto mb-4"
          aria-hidden="true"
        />
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          {copy.success}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {copy.successMessage}
        </p>
        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-4 text-left">
          <Clock
            className="w-4 h-4 shrink-0 mt-0.5 text-primary"
            aria-hidden="true"
          />
          <p>{copy.successNext}</p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-primary hover:underline py-2"
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-3 text-base sm:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[48px]";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";
  const reqMark = <span className="text-danger">*</span>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tier selector — most prominent */}
      <div>
        <label className={labelCls}>
          {copy.fields.tier} {reqMark}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["basic", "standard", "pro"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors min-h-[48px] ${
                tier === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground border-border hover:border-primary/50"
              }`}
            >
              {copy.tiers[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelCls}>
          {copy.fields.company} {reqMark}
        </label>
        <div
          className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden ${
            errors.company ? "border-danger" : "border-border"
          }`}
        >
          <span
            aria-hidden="true"
            className="flex items-center px-3 bg-muted border-r border-border"
          >
            <Building2
              className="w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <input
            type="text"
            id="company"
            name="company"
            required
            maxLength={150}
            autoComplete="organization"
            className="flex-1 min-w-0 px-4 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
          />
        </div>
        {errors.company && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.company}
          </p>
        )}
      </div>

      {/* EIK + Contact person */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eik" className={labelCls}>
            {copy.fields.eik}
          </label>
          <input
            type="text"
            id="eik"
            name="eik"
            maxLength={30}
            inputMode="numeric"
            className={`${inputCls} border-border`}
          />
        </div>
        <div>
          <label htmlFor="contact" className={labelCls}>
            {copy.fields.contact} {reqMark}
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            required
            maxLength={100}
            autoComplete="name"
            className={`${inputCls} ${
              errors.contact ? "border-danger" : "border-border"
            }`}
          />
          {errors.contact && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.contact}
            </p>
          )}
        </div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className={labelCls}>
            {copy.fields.phone} {reqMark}
          </label>
          <div
            className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden ${
              errors.phone ? "border-danger" : "border-border"
            }`}
          >
            <span
              aria-hidden="true"
              className="flex items-center px-3 bg-muted text-sm font-medium text-muted-foreground border-r border-border tabular-nums"
            >
              +359
            </span>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="88 123 4567"
              required
              maxLength={20}
              autoComplete="tel-national"
              inputMode="tel"
              pattern="[0-9 ()\-]{7,}"
              onInput={(e) => {
                const el = e.currentTarget;
                const clean = el.value
                  .replace(/^\+?359\s?/, "")
                  .replace(/^0+/, "");
                if (clean !== el.value) el.value = clean;
              }}
              className="flex-1 min-w-0 px-4 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            {copy.fields.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={200}
            autoComplete="email"
            className={`${inputCls} border-border`}
          />
        </div>
      </div>

      {/* Units count + type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="units" className={labelCls}>
            {copy.fields.units} {reqMark}
          </label>
          <input
            type="number"
            id="units"
            name="units"
            required
            min={3}
            max={500}
            inputMode="numeric"
            className={`${inputCls} ${
              errors.units ? "border-danger" : "border-border"
            }`}
          />
          {errors.units && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.units}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="unitType" className={labelCls}>
            {copy.fields.unitType}
          </label>
          <input
            type="text"
            id="unitType"
            name="unitType"
            placeholder={copy.fields.unitTypePlaceholder}
            maxLength={120}
            className={`${inputCls} border-border`}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className={labelCls}>
          {copy.fields.address} {reqMark}
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          maxLength={250}
          autoComplete="street-address"
          className={`${inputCls} ${
            errors.address ? "border-danger" : "border-border"
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.address}
          </p>
        )}
      </div>

      {/* Survey time */}
      <div>
        <label htmlFor="surveyTime" className={labelCls}>
          {copy.fields.surveyTime}
        </label>
        <input
          type="text"
          id="surveyTime"
          name="surveyTime"
          maxLength={120}
          className={`${inputCls} border-border`}
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelCls}>
          {copy.fields.notes}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder={copy.fields.notesPlaceholder}
          className="w-full px-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <div
          className="flex items-center gap-2 bg-danger-light text-danger rounded-lg p-3 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {copy.errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[48px] text-base sm:text-sm"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {copy.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {copy.submit}
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center font-medium">
        {copy.reassurance}
      </p>
      <p className="text-xs text-muted-foreground text-center">{copy.privacy}</p>
    </form>
  );
}
