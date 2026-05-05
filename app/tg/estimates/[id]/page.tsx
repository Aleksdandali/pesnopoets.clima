"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMiniApp } from "../../TgShell";
import { useTelegram } from "../../../../telegram-miniapp/hooks/useTelegram";
import { useParams } from "next/navigation";
import {
  Loader2, Mic, Square, FileText, Share2, ImageOff, X, Check,
  Minus, Plus, Send, ArrowUp, ChevronDown, ChevronUp, Trash2, Search, Package, Wrench,
} from "lucide-react";
import { LABOR_PRESETS, type LaborPreset } from "../../../../lib/estimates/labor-presets";

/* ─── Types ─── */

interface EstimateParams {
  area_m2: number | null;
  ceiling_height_m: number | null;
  orientation: "north" | "south" | "east" | "west" | "unknown";
  floor: number | null;
  top_floor: boolean;
  insulation: "good" | "average" | "poor";
  windows_count: number | null;
  large_windows: boolean;
  occupants: number | null;
  heat_sources: boolean;
  room_type: string | null;
  building_type: "panel" | "brick" | "house" | "new_build" | "unknown";
  wall_type: "concrete" | "brick" | "aerated" | "drywall" | "unknown";
  pipe_length_m: number;
  outdoor_unit: "balcony" | "facade_accessible" | "facade_no_access" | "roof" | "ground" | "unknown";
  needs_climber: boolean;
  dismantle_old: boolean;
  old_unit_btu: number | null;
  electrical_ready: boolean | null;
  needs_drain_pump: boolean;
  decorative_channel: boolean;
  channel_length_m: number | null;
  concrete_drilling: boolean;
  client_name: string | null;
  client_phone: string | null;
  client_address: string | null;
  notes: string;
  confidence: "high" | "medium" | "low";
}

interface ExtraItem {
  name: string;
  price_bgn: number;
}

interface EquipmentLine {
  product_id: number | null;
  manufacturer: string;
  title: string;
  btu: number | null;
  qty: number;
  unit_price_eur: number;
  total_eur: number;
}

interface LaborLine {
  preset_key: string | null;
  title: string;
  unit: string;
  qty: number;
  unit_price_eur: number;
  total_eur: number;
}

interface Estimate {
  id: number;
  params: EstimateParams | { chat_history?: unknown[]; extracted?: EstimateParams };
  transcript: string | null;
  area_m2: number | null;
  recommended_btu: number | null;
  selected_btu: number | null;
  base_install_bgn: number | null;
  extra_pipe_m: number | null;
  extra_pipe_bgn: number | null;
  extras: ExtraItem[] | null;
  total_install_bgn: number | null;
  product_id: number | null;
  product_title: string | null;
  product_price_eur: number | null;
  client_name: string | null;
  client_phone: string | null;
  status: string;
  created_at: string;
  equipment_lines: EquipmentLine[] | null;
  labor_lines: LaborLine[] | null;
  kp_number: string | null;
  valid_until: string | null;
}

interface Product {
  id: number;
  title: string;
  title_override: string | null;
  manufacturer: string;
  price_client: number;
  price_override: number | null;
  price_promo: number | null;
  is_promo: boolean;
  btu: number;
  gallery: string[] | null;
  availability: string;
}

type PdfLang = "bg" | "en" | "ru" | "ua";
type EditingChip = string | null;

/* ─── Helpers ─── */

const EUR_TO_BGN = 1.95583;

function getExtractedParams(est: Estimate): EstimateParams | null {
  if (!est.params) return null;
  if ("area_m2" in est.params) return est.params as EstimateParams;
  const nested = est.params as { extracted?: EstimateParams };
  return nested.extracted || null;
}

function bgnToEur(bgn: number): number {
  return Math.round((bgn / EUR_TO_BGN) * 100) / 100;
}

/* ─── Chip config ─── */

interface ChipDef {
  key: string;
  label: (v: unknown) => string;
  type: "number" | "segment" | "toggle" | "stepper";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  group: "room" | "install";
}

const ORIENTATION_MAP: Record<string, string> = {
  north: "С", south: "Ю", east: "В", west: "З", unknown: "?",
};
const BUILDING_MAP: Record<string, string> = {
  panel: "Панел", brick: "Кирп", house: "Дом", new_build: "Нова", unknown: "?",
};
const OUTDOOR_MAP: Record<string, string> = {
  balcony: "Балкон", facade_accessible: "Фасад", facade_no_access: "Фас(н/д)",
  roof: "Крыша", ground: "Земля", unknown: "?",
};
const INSULATION_MAP: Record<string, string> = {
  good: "Хор", average: "Ср", poor: "Пл",
};
const WALL_MAP: Record<string, string> = {
  concrete: "Бетон", brick: "Кирп", aerated: "Газоб", drywall: "ГКЛ", unknown: "?",
};

const CHIPS: ChipDef[] = [
  {
    key: "area_m2", required: true, group: "room",
    label: (v) => v ? `${v} м\u00B2` : "Площадь?",
    type: "number", min: 5, max: 200,
  },
  {
    key: "floor", group: "room",
    label: (v) => v ? `${v} эт` : "Этаж?",
    type: "number", min: 1, max: 30,
  },
  {
    key: "orientation", group: "room",
    label: (v) => ORIENTATION_MAP[v as string] || "Стор?",
    type: "segment",
    options: [
      { value: "north", label: "С" },
      { value: "south", label: "Ю" },
      { value: "east", label: "В" },
      { value: "west", label: "З" },
    ],
  },
  {
    key: "building_type", group: "room",
    label: (v) => BUILDING_MAP[v as string] || "Тип?",
    type: "segment",
    options: [
      { value: "panel", label: "Панел" },
      { value: "brick", label: "Кирп" },
      { value: "house", label: "Дом" },
      { value: "new_build", label: "Нова" },
    ],
  },
  {
    key: "insulation", group: "room",
    label: (v) => `Из:${INSULATION_MAP[v as string] || "?"}`,
    type: "segment",
    options: [
      { value: "good", label: "Хор" },
      { value: "average", label: "Средн" },
      { value: "poor", label: "Плох" },
    ],
  },
  {
    key: "pipe_length_m", group: "install",
    label: (v) => `${v}м тр`,
    type: "stepper", min: 1, max: 30, step: 1,
  },
  {
    key: "outdoor_unit", group: "install",
    label: (v) => OUTDOOR_MAP[v as string] || "Нар.?",
    type: "segment",
    options: [
      { value: "balcony", label: "Балкон" },
      { value: "facade_accessible", label: "Фасад" },
      { value: "ground", label: "Земля" },
    ],
  },
  {
    key: "wall_type", group: "install",
    label: (v) => WALL_MAP[v as string] || "Стена?",
    type: "segment",
    options: [
      { value: "concrete", label: "Бетон" },
      { value: "brick", label: "Кирп" },
      { value: "aerated", label: "Газоб" },
    ],
  },
  {
    key: "dismantle_old", group: "install",
    label: (v) => v ? "Демонт" : "Б/дем",
    type: "toggle",
  },
];

const ROOM_CHIPS = CHIPS.filter((c) => c.group === "room");
const INSTALL_CHIPS = CHIPS.filter((c) => c.group === "install");

/* ─── Component ─── */

export default function TgEstimateHubPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const { id } = useParams();

  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [params, setParams] = useState<EstimateParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingChip, setEditingChip] = useState<EditingChip>(null);
  const [editValue, setEditValue] = useState<string | number | boolean>("");

  // PDF
  const [pdfLang, setPdfLang] = useState<PdfLang>("bg");
  const [pdfLoading, setPdfLoading] = useState(false);

  // Product selector
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Voice correction
  const [voicePhase, setVoicePhase] = useState<"idle" | "recording" | "processing">("idle");
  const [voiceElapsed, setVoiceElapsed] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const voiceChunks = useRef<Blob[]>([]);
  const voiceTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  // Mini-chat — single question mode
  const [chatQuestion, setChatQuestion] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);

  // Details expand
  const [showDetails, setShowDetails] = useState(false);

  // Multi-line sections
  const [showEquipmentSection, setShowEquipmentSection] = useState(true);
  const [showLaborSection, setShowLaborSection] = useState(true);
  const [equipmentModal, setEquipmentModal] = useState<"closed" | "catalog" | "manual">("closed");
  const [equipQuery, setEquipQuery] = useState("");
  const [equipResults, setEquipResults] = useState<Product[]>([]);
  const [equipSearching, setEquipSearching] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [pendingQty, setPendingQty] = useState(1);
  const [manualEquip, setManualEquip] = useState({ manufacturer: "", title: "", btu: "", qty: "1", price: "" });
  const [customLabor, setCustomLabor] = useState<{ open: boolean; title: string; price: string }>({ open: false, title: "", price: "" });

  const equipmentLines: EquipmentLine[] = estimate?.equipment_lines ?? [];
  const laborLines: LaborLine[] = estimate?.labor_lines ?? [];

  /* ─── Load estimate ─── */

  const load = useCallback(async () => {
    try {
      const data = (await fetch(`/api/tg/estimates/${id}`)) as { estimate: Estimate };
      setEstimate(data.estimate);
      const extracted = getExtractedParams(data.estimate);
      if (extracted) setParams(extracted);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch, id]);

  useEffect(() => { load(); }, [load]);

  // Generate single question about missing params
  useEffect(() => {
    if (!params || chatQuestion !== null) return;
    const missing: string[] = [];
    if (!params.area_m2) missing.push("площадь (м2)");
    if (!params.floor) missing.push("этаж");
    if (params.building_type === "unknown") missing.push("тип здания");
    if (params.outdoor_unit === "unknown") missing.push("наружный блок");

    if (missing.length > 0 && missing.length <= 4) {
      setChatQuestion(`Уточните: ${missing.join(", ")}`);
    }
  }, [params, chatQuestion]);

  // Send chat message (text) to collect missing params
  async function sendChatMessage() {
    const text = chatInput.trim();
    if (!text || chatSending) return;
    setChatInput("");
    setChatSending(true);
    tg.haptic.light();

    try {
      const res = (await fetch(`/api/tg/estimates/${id}/chat`, {
        method: "POST",
        body: JSON.stringify({ message: text }),
      })) as { reply: string; params: EstimateParams | null; calculation: unknown };

      setChatQuestion(null); // hide prompt after answer

      // Reload estimate
      const estData = (await fetch(`/api/tg/estimates/${id}`)) as { estimate: Estimate };
      setEstimate(estData.estimate);
      const extracted = getExtractedParams(estData.estimate);
      if (extracted) setParams(extracted);

      tg.haptic.success();
    } catch {
      tg.haptic.error();
    }
    setChatSending(false);
  }

  /* ─── Chip editing ─── */

  function openChipEditor(chip: ChipDef) {
    if (!params) return;
    const currentVal = (params as unknown as Record<string, unknown>)[chip.key];

    // Toggle chips: instant save, no editor needed
    if (chip.type === "toggle") {
      saveChipValue(chip.key, !currentVal);
      return;
    }

    setEditingChip(editingChip === chip.key ? null : chip.key);
    setEditValue(currentVal as string | number | boolean ?? "");
    tg.haptic.select();
  }

  async function saveChipValue(key: string, value: unknown) {
    if (!params) return;
    const newParams = { ...params, [key]: value };

    if (key === "floor" && typeof value === "number") {
      newParams.top_floor = value >= 8;
    }

    if (key === "building_type" && value === "panel") {
      newParams.wall_type = "concrete";
      newParams.concrete_drilling = true;
    }

    setParams(newParams);
    setEditingChip(null);
    setSaving(true);
    tg.haptic.light();

    try {
      const data = (await fetch(`/api/tg/estimates/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          params: newParams,
          product_id: estimate?.product_id,
          product_title: estimate?.product_title,
          product_price_eur: estimate?.product_price_eur,
        }),
      })) as { estimate: Estimate };
      setEstimate(data.estimate);
      const extracted = getExtractedParams(data.estimate);
      if (extracted) setParams(extracted);
      tg.haptic.success();
    } catch {
      tg.haptic.error();
    }
    setSaving(false);
  }

  /* ─── Product selector ─── */

  async function openProductSelector() {
    setShowProducts(true);
    setProductsLoading(true);
    tg.haptic.medium();

    try {
      const btu = estimate?.recommended_btu || 12000;
      const minBtu = Math.floor(btu * 0.7);
      const maxBtu = Math.ceil(btu * 1.5);

      const data = (await fetch(
        `/api/tg/estimates/${id}/products?min_btu=${minBtu}&max_btu=${maxBtu}`
      )) as { products: Product[] };
      setProducts(data.products);
    } catch {
      try {
        const data = (await fetch("/api/tg/admin/products?page=1")) as { products: Product[] };
        setProducts(data.products.filter((p) => p.btu > 0));
      } catch {
        setProducts([]);
      }
    }
    setProductsLoading(false);
  }

  async function selectProduct(product: Product) {
    const effectivePrice = product.price_override
      ?? (product.is_promo && product.price_promo ? product.price_promo : product.price_client);

    setSaving(true);
    tg.haptic.medium();

    try {
      const data = (await fetch(`/api/tg/estimates/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          product_id: product.id,
          product_title: product.title_override || product.title,
          product_price_eur: Number(effectivePrice),
        }),
      })) as { estimate: Estimate };
      setEstimate(data.estimate);
      tg.haptic.success();
    } catch {
      tg.haptic.error();
    }

    setSaving(false);
    setShowProducts(false);
  }

  function clearProduct() {
    setSaving(true);
    tg.haptic.light();

    fetch(`/api/tg/estimates/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        product_id: null,
        product_title: null,
        product_price_eur: null,
      }),
    })
      .then((data: unknown) => {
        setEstimate((data as { estimate: Estimate }).estimate);
        tg.haptic.success();
      })
      .catch(() => tg.haptic.error())
      .finally(() => setSaving(false));
  }

  /* ─── Multi-line: Equipment ─── */

  async function persistLines(next: { equipment_lines?: EquipmentLine[]; labor_lines?: LaborLine[] }) {
    if (!estimate) return;
    setSaving(true);
    tg.haptic.light();
    try {
      const data = (await fetch(`/api/tg/estimates/${id}`, {
        method: "PATCH",
        body: JSON.stringify(next),
      })) as { estimate: Estimate };
      setEstimate(data.estimate);
      tg.haptic.success();
    } catch {
      tg.haptic.error();
    }
    setSaving(false);
  }

  async function searchEquipment(q: string) {
    setEquipQuery(q);
    setEquipSearching(true);
    try {
      const data = (await fetch(`/api/tg/estimates/${id}/products?q=${encodeURIComponent(q)}`)) as { products: Product[] };
      setEquipResults(data.products);
    } catch {
      setEquipResults([]);
    }
    setEquipSearching(false);
  }

  function addEquipmentFromProduct(p: Product, qty: number) {
    const price = p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client);
    const next: EquipmentLine = {
      product_id: p.id,
      manufacturer: p.manufacturer || "",
      title: p.title_override || p.title,
      btu: p.btu || null,
      qty,
      unit_price_eur: Number(price),
      total_eur: Math.round(qty * Number(price) * 100) / 100,
    };
    persistLines({ equipment_lines: [...equipmentLines, next] });
    setEquipmentModal("closed");
    setPendingProduct(null);
    setPendingQty(1);
    setEquipQuery("");
    setEquipResults([]);
  }

  function addEquipmentManual() {
    const m = manualEquip;
    const qty = Math.max(1, parseInt(m.qty) || 1);
    const price = parseFloat(m.price) || 0;
    if (!m.title.trim() || price <= 0) {
      tg.haptic.error();
      return;
    }
    const next: EquipmentLine = {
      product_id: null,
      manufacturer: m.manufacturer.trim(),
      title: m.title.trim(),
      btu: m.btu ? parseInt(m.btu) || null : null,
      qty,
      unit_price_eur: price,
      total_eur: Math.round(qty * price * 100) / 100,
    };
    persistLines({ equipment_lines: [...equipmentLines, next] });
    setEquipmentModal("closed");
    setManualEquip({ manufacturer: "", title: "", btu: "", qty: "1", price: "" });
  }

  function removeEquipment(idx: number) {
    persistLines({ equipment_lines: equipmentLines.filter((_, i) => i !== idx) });
  }

  function updateEquipment(idx: number, patch: Partial<EquipmentLine>) {
    const updated = equipmentLines.map((l, i) => {
      if (i !== idx) return l;
      const merged = { ...l, ...patch };
      merged.total_eur = Math.round(merged.qty * merged.unit_price_eur * 100) / 100;
      return merged;
    });
    persistLines({ equipment_lines: updated });
  }

  /* ─── Multi-line: Labor ─── */

  function addLaborPreset(preset: LaborPreset) {
    const next: LaborLine = {
      preset_key: preset.key,
      title: preset.title,
      unit: preset.unit,
      qty: preset.qty,
      unit_price_eur: preset.unit_price_eur,
      total_eur: Math.round(preset.qty * preset.unit_price_eur * 100) / 100,
    };
    persistLines({ labor_lines: [...laborLines, next] });
    tg.haptic.success();
  }

  function addLaborCustom() {
    const title = customLabor.title.trim();
    const price = parseFloat(customLabor.price) || 0;
    if (!title || price <= 0) {
      tg.haptic.error();
      return;
    }
    const next: LaborLine = {
      preset_key: null,
      title,
      unit: "бр.",
      qty: 1,
      unit_price_eur: price,
      total_eur: price,
    };
    persistLines({ labor_lines: [...laborLines, next] });
    setCustomLabor({ open: false, title: "", price: "" });
  }

  function removeLabor(idx: number) {
    persistLines({ labor_lines: laborLines.filter((_, i) => i !== idx) });
  }

  function updateLabor(idx: number, patch: Partial<LaborLine>) {
    const updated = laborLines.map((l, i) => {
      if (i !== idx) return l;
      const merged = { ...l, ...patch };
      merged.total_eur = Math.round(merged.qty * merged.unit_price_eur * 100) / 100;
      return merged;
    });
    persistLines({ labor_lines: updated });
  }

  /* ─── PDF ─── */

  async function fetchPdfBlob(): Promise<Blob | null> {
    try {
      const { getToken } = await import("../../../../telegram-miniapp/lib/api");
      const token = getToken();
      const res = await window.fetch(`/api/tg/estimates/${id}/pdf?lang=${pdfLang}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("PDF error");
      return await res.blob();
    } catch {
      return null;
    }
  }

  async function downloadPDF() {
    setPdfLoading(true);
    tg.haptic.medium();
    const blob = await fetchPdfBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KP-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      tg.haptic.success();
    } else {
      tg.haptic.error();
    }
    setPdfLoading(false);
  }

  async function sharePDF() {
    setPdfLoading(true);
    tg.haptic.medium();
    const blob = await fetchPdfBlob();
    if (!blob) { tg.haptic.error(); setPdfLoading(false); return; }

    const file = new File([blob], `KP-${id}.pdf`, { type: "application/pdf" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: `KP #${id}`, files: [file] });
        tg.haptic.success();
      } catch { /* cancelled */ }
    } else {
      await downloadPDF();
    }
    setPdfLoading(false);
  }

  /* ─── Voice correction ─── */

  async function startVoiceCorrection() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      voiceChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) voiceChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(voiceTimer.current);

        const blob = new Blob(voiceChunks.current, { type: "audio/webm" });
        if (blob.size < 500) { setVoicePhase("idle"); return; }

        setVoicePhase("processing");
        tg.haptic.medium();

        try {
          const { getToken } = await import("../../../../telegram-miniapp/lib/api");
          const token = getToken();

          const formData = new FormData();
          formData.append("audio", blob, "voice.webm");

          const res = await window.fetch("/api/tg/estimates/transcribe", {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const { params: newParams } = await res.json();

          if (newParams && params) {
            const merged = { ...params };
            for (const [k, v] of Object.entries(newParams)) {
              if (v === null || v === "unknown" || v === false || v === 0) continue;
              if (k === "pipe_length_m" && v === 3) continue;
              if (k === "confidence" || k === "notes") continue;
              (merged as unknown as Record<string, unknown>)[k] = v;
            }

            setParams(merged);
            setSaving(true);
            const data = (await fetch(`/api/tg/estimates/${id}`, {
              method: "PATCH",
              body: JSON.stringify({
                params: merged,
                product_id: estimate?.product_id,
                product_title: estimate?.product_title,
                product_price_eur: estimate?.product_price_eur,
              }),
            })) as { estimate: Estimate };
            setEstimate(data.estimate);
            const extracted = getExtractedParams(data.estimate);
            if (extracted) setParams(extracted);
            setSaving(false);
          }

          tg.haptic.success();
        } catch {
          tg.haptic.error();
        }
        setVoicePhase("idle");
      };

      mediaRecorder.current = recorder;
      recorder.start(250);
      setVoicePhase("recording");
      setVoiceElapsed(0);
      tg.haptic.medium();
      voiceTimer.current = setInterval(() => setVoiceElapsed((p) => p + 1), 1000);
    } catch {
      tg.haptic.error();
      setVoicePhase("idle");
    }
  }

  function stopVoiceCorrection() {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ─── Render helpers ─── */

  function renderChipEditor(chip: ChipDef) {
    if (!params) return null;
    const currentVal = (params as unknown as Record<string, unknown>)[chip.key];

    if (chip.type === "number") {
      return (
        <div
          className="flex items-center gap-2 p-2 rounded-xl mt-1.5"
          style={{ background: cardBg, border: `1px solid ${chipBorder}` }}
        >
          <input
            type="number"
            defaultValue={currentVal as number || ""}
            min={chip.min}
            max={chip.max}
            autoFocus
            inputMode="numeric"
            className="flex-1 h-[44px] px-3 rounded-lg text-[16px] font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(v)) saveChipValue(chip.key, v);
              }
            }}
            onChange={(e) => setEditValue(parseInt(e.target.value))}
          />
          <button
            onClick={() => {
              const v = typeof editValue === "number" ? editValue : parseInt(String(editValue));
              if (!isNaN(v)) saveChipValue(chip.key, v);
              else setEditingChip(null);
            }}
            className="w-[44px] h-[44px] rounded-lg flex items-center justify-center shrink-0"
            style={{ background: tg.theme.link }}
          >
            <Check className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setEditingChip(null)}
            className="w-[44px] h-[44px] rounded-lg flex items-center justify-center shrink-0"
            style={{ background: chipBg }}
          >
            <X className="w-5 h-5" style={{ color: tg.theme.hint }} />
          </button>
        </div>
      );
    }

    if (chip.type === "stepper") {
      const numVal = (currentVal as number) || chip.min || 1;
      return (
        <div
          className="flex items-center justify-center gap-4 p-2 rounded-xl mt-1.5"
          style={{ background: cardBg, border: `1px solid ${chipBorder}` }}
        >
          <button
            onClick={() => saveChipValue(chip.key, Math.max(chip.min || 1, numVal - (chip.step || 1)))}
            className="w-[48px] h-[48px] rounded-xl flex items-center justify-center"
            style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
          >
            <Minus className="w-5 h-5" style={{ color: tg.theme.text }} />
          </button>
          <span className="text-[20px] font-bold tabular-nums min-w-[48px] text-center" style={{ color: tg.theme.text }}>
            {numVal}
          </span>
          <button
            onClick={() => saveChipValue(chip.key, Math.min(chip.max || 30, numVal + (chip.step || 1)))}
            className="w-[48px] h-[48px] rounded-xl flex items-center justify-center"
            style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
          >
            <Plus className="w-5 h-5" style={{ color: tg.theme.text }} />
          </button>
        </div>
      );
    }

    if (chip.type === "segment" && chip.options) {
      return (
        <div
          className="flex gap-1.5 p-2 rounded-xl mt-1.5"
          style={{ background: cardBg, border: `1px solid ${chipBorder}` }}
        >
          {chip.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => saveChipValue(chip.key, opt.value)}
              className="flex-1 min-w-0 py-3 rounded-lg text-[14px] font-semibold transition-colors"
              style={{
                background: currentVal === opt.value ? tg.theme.link : chipBg,
                color: currentVal === opt.value ? "#fff" : tg.theme.text,
                border: `1px solid ${currentVal === opt.value ? tg.theme.link : chipBorder}`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    return null;
  }

  function renderChipRow(chips: ChipDef[]) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => {
          const val = params ? (params as unknown as Record<string, unknown>)[chip.key] : null;
          const isMissing = chip.required && (val === null || val === undefined || val === "unknown");
          const isEditing = editingChip === chip.key;

          return (
            <button
              key={chip.key}
              onClick={() => openChipEditor(chip)}
              className="px-3 py-2 rounded-xl text-[14px] font-semibold transition-all active:scale-95"
              style={{
                background: isEditing ? tg.theme.link
                  : isMissing ? "rgba(239,68,68,0.15)"
                  : chipBg,
                border: `1.5px solid ${
                  isMissing ? "#ef4444"
                  : isEditing ? tg.theme.link
                  : chipBorder
                }`,
                color: isEditing ? "#fff"
                  : isMissing ? "#ef4444"
                  : tg.theme.text,
                minHeight: "40px",
              }}
            >
              {chip.label(val)}
            </button>
          );
        })}
      </div>
    );
  }

  /* ─── Render ─── */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
      </div>
    );
  }

  if (!estimate) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[15px]" style={{ color: tg.theme.hint }}>Просчёт не найден</p>
      </div>
    );
  }

  const hasCalc = !!(estimate.total_install_bgn && estimate.total_install_bgn > 0);
  const installEur = hasCalc ? bgnToEur(estimate.total_install_bgn!) : 0;
  const baseInstallEur = estimate.base_install_bgn ? bgnToEur(estimate.base_install_bgn) : 0;
  const extraPipeEur = estimate.extra_pipe_bgn ? bgnToEur(estimate.extra_pipe_bgn) : 0;
  const productEur = estimate.product_price_eur || 0;
  const totalEur = installEur + productEur;
  const extras = estimate.extras || [];

  const chipBorder = tg.theme.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.10)";
  const chipBg = tg.theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const cardBg = tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.02)";
  const dividerColor = tg.theme.isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  // Count missing required params for guidance
  const missingCount = params ? [
    !params.area_m2,
    params.building_type === "unknown",
    params.outdoor_unit === "unknown",
  ].filter(Boolean).length : 0;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ─── HERO: Price Block ─── */}
        {hasCalc ? (
          <div className="px-3 pt-3 pb-1">
            <div
              className="rounded-2xl p-4"
              style={{ background: cardBg, border: `1px solid ${dividerColor}` }}
            >
              {/* Total price — THE hero */}
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: tg.theme.hint }}>
                  {estimate.product_title ? "Итого" : "Монтаж"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-[32px] font-extrabold tabular-nums leading-none"
                    style={{ color: tg.theme.text }}
                  >
                    {Math.round(estimate.product_title ? totalEur : installEur)}
                  </span>
                  <span className="text-[16px] font-bold" style={{ color: tg.theme.hint }}>EUR</span>
                </div>
              </div>

              {/* BTU badge */}
              {estimate.recommended_btu && (
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-[13px] font-bold px-3 py-1 rounded-full"
                    style={{ background: chipBg, color: tg.theme.text, border: `1px solid ${chipBorder}` }}
                  >
                    {(estimate.recommended_btu / 1000).toFixed(0)}K BTU
                  </span>
                  {saving && (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: tg.theme.hint }} />
                      <span className="text-[12px]" style={{ color: tg.theme.hint }}>...</span>
                    </span>
                  )}
                </div>
              )}

              {/* Expandable breakdown */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 mt-3 active:opacity-70"
              >
                <span className="text-[13px] font-medium" style={{ color: tg.theme.link }}>
                  {showDetails ? "Скрыть детали" : "Детали расчёта"}
                </span>
                {showDetails
                  ? <ChevronUp className="w-4 h-4" style={{ color: tg.theme.link }} />
                  : <ChevronDown className="w-4 h-4" style={{ color: tg.theme.link }} />
                }
              </button>

              {showDetails && (
                <div className="mt-2 space-y-1.5 pt-2" style={{ borderTop: `1px solid ${dividerColor}` }}>
                  <div className="flex justify-between text-[14px]" style={{ color: tg.theme.text }}>
                    <span>
                      Монтаж (до {estimate.recommended_btu && estimate.recommended_btu <= 14000 ? "14K" : "24K"} BTU, 3м)
                    </span>
                    <span className="tabular-nums font-medium">{Math.round(baseInstallEur)} EUR</span>
                  </div>

                  {(estimate.extra_pipe_m ?? 0) > 0 && (
                    <div className="flex justify-between text-[14px]" style={{ color: tg.theme.text }}>
                      <span>Доп. труба {estimate.extra_pipe_m}м</span>
                      <span className="tabular-nums font-medium">{Math.round(extraPipeEur)} EUR</span>
                    </div>
                  )}

                  {extras.map((ex, i) => (
                    <div key={i} className="flex justify-between text-[14px]" style={{ color: tg.theme.text }}>
                      <span>{ex.name}</span>
                      <span className="tabular-nums font-medium">{Math.round(bgnToEur(ex.price_bgn))} EUR</span>
                    </div>
                  ))}

                  <div className="border-t pt-1.5" style={{ borderColor: dividerColor }}>
                    <div className="flex justify-between text-[15px] font-bold" style={{ color: tg.theme.text }}>
                      <span>Монтаж</span>
                      <span className="tabular-nums">{Math.round(installEur)} EUR</span>
                    </div>
                  </div>

                  {estimate.product_title && (
                    <div className="flex justify-between items-center text-[14px]" style={{ color: tg.theme.text }}>
                      <span className="flex-1 min-w-0 truncate pr-2">{estimate.product_title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="tabular-nums font-medium">{Math.round(productEur)} EUR</span>
                        <button
                          onClick={clearProduct}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: chipBg }}
                        >
                          <X className="w-4 h-4" style={{ color: tg.theme.hint }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* No calculation — guiding state */
          <div className="px-3 pt-3 pb-1">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1.5px solid rgba(239,68,68,0.2)",
              }}
            >
              <p className="text-[16px] font-bold mb-1" style={{ color: tg.theme.text }}>
                Нет расчёта
              </p>
              <p className="text-[14px] leading-snug" style={{ color: tg.theme.hint }}>
                {missingCount > 0
                  ? `Заполните ${missingCount === 1 ? "параметр" : "параметры"} ниже (красные) или уточните голосом`
                  : "Проверьте параметры ниже и сохраните"
                }
              </p>
            </div>
          </div>
        )}

        {/* ─── Parameter Chips — grouped ─── */}
        <div className="px-3 pt-2 pb-1">
          {/* Room group */}
          <div className="mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tg.theme.hint }}>
              Помещение
            </span>
          </div>
          {renderChipRow(ROOM_CHIPS)}
          {editingChip && ROOM_CHIPS.find((c) => c.key === editingChip) &&
            renderChipEditor(ROOM_CHIPS.find((c) => c.key === editingChip)!)
          }

          {/* Install group */}
          <div className="mt-3 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tg.theme.hint }}>
              Монтаж
            </span>
          </div>
          {renderChipRow(INSTALL_CHIPS)}
          {editingChip && INSTALL_CHIPS.find((c) => c.key === editingChip) &&
            renderChipEditor(INSTALL_CHIPS.find((c) => c.key === editingChip)!)
          }
        </div>

        {/* ─── Mini-chat — single inline prompt ─── */}
        {chatQuestion && (
          <div className="px-3 pt-2 pb-1">
            <div
              className="rounded-xl p-3"
              style={{ background: cardBg, border: `1px solid ${dividerColor}` }}
            >
              <p className="text-[13px] mb-2" style={{ color: tg.theme.text }}>
                {chatQuestion}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendChatMessage(); } }}
                  placeholder="Напр: 30м2, 5 этаж, панелка"
                  disabled={chatSending}
                  className="flex-1 h-[44px] px-3 rounded-xl text-[14px] outline-none"
                  style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatSending || !chatInput.trim()}
                  className="w-[44px] h-[44px] rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: chatInput.trim() ? tg.theme.link : chipBg }}
                >
                  {chatSending
                    ? <Loader2 className="w-5 h-5 animate-spin text-white" />
                    : <ArrowUp className="w-5 h-5" style={{ color: chatInput.trim() ? "#fff" : tg.theme.hint }} />
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Equipment lines (multi) ─── */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setShowEquipmentSection((v) => !v)}
            className="w-full flex items-center justify-between mb-1.5"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: tg.theme.hint }}>
              <Package className="w-3.5 h-3.5" />
              Оборудование {equipmentLines.length > 0 && `(${equipmentLines.length})`}
            </span>
            {showEquipmentSection
              ? <ChevronUp className="w-4 h-4" style={{ color: tg.theme.hint }} />
              : <ChevronDown className="w-4 h-4" style={{ color: tg.theme.hint }} />}
          </button>

          {showEquipmentSection && (
            <div className="space-y-1.5">
              {equipmentLines.map((line, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-2.5"
                  style={{ background: cardBg, border: `1px solid ${dividerColor}` }}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold leading-tight" style={{ color: tg.theme.text }}>
                        {line.manufacturer ? `${line.manufacturer} ` : ""}{line.title}
                      </p>
                      {line.btu && (
                        <p className="text-[11px] mt-0.5" style={{ color: tg.theme.hint }}>
                          {(line.btu / 1000).toFixed(0)}K BTU
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeEquipment(idx)}
                      className="w-[36px] h-[36px] rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: chipBg }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateEquipment(idx, { qty: Math.max(1, line.qty - 1) })}
                        className="w-[36px] h-[36px] rounded-lg flex items-center justify-center"
                        style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
                      >
                        <Minus className="w-4 h-4" style={{ color: tg.theme.text }} />
                      </button>
                      <span className="text-[16px] font-bold tabular-nums w-[28px] text-center" style={{ color: tg.theme.text }}>
                        {line.qty}
                      </span>
                      <button
                        onClick={() => updateEquipment(idx, { qty: line.qty + 1 })}
                        className="w-[36px] h-[36px] rounded-lg flex items-center justify-center"
                        style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
                      >
                        <Plus className="w-4 h-4" style={{ color: tg.theme.text }} />
                      </button>
                    </div>
                    <span className="text-[12px]" style={{ color: tg.theme.hint }}>×</span>
                    <input
                      type="number"
                      value={line.unit_price_eur}
                      onChange={(e) => updateEquipment(idx, { unit_price_eur: parseFloat(e.target.value) || 0 })}
                      className="flex-1 h-[36px] px-2 rounded-lg text-[14px] font-semibold tabular-nums text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                    />
                    <span className="text-[12px]" style={{ color: tg.theme.hint }}>EUR =</span>
                    <span className="text-[15px] font-bold tabular-nums shrink-0" style={{ color: tg.theme.text }}>
                      {line.total_eur.toFixed(0)} EUR
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setEquipmentModal("catalog")}
                className="w-full h-[48px] rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold"
                style={{ background: chipBg, border: `1.5px dashed ${chipBorder}`, color: tg.theme.text }}
              >
                <Plus className="w-4 h-4" />
                Добавить оборудование
              </button>
            </div>
          )}
        </div>

        {/* ─── Labor lines (multi) ─── */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setShowLaborSection((v) => !v)}
            className="w-full flex items-center justify-between mb-1.5"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: tg.theme.hint }}>
              <Wrench className="w-3.5 h-3.5" />
              Работы {laborLines.length > 0 && `(${laborLines.length})`}
            </span>
            {showLaborSection
              ? <ChevronUp className="w-4 h-4" style={{ color: tg.theme.hint }} />
              : <ChevronDown className="w-4 h-4" style={{ color: tg.theme.hint }} />}
          </button>

          {showLaborSection && (
            <>
              {/* Existing labor rows */}
              <div className="space-y-1.5">
                {laborLines.map((line, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-2.5"
                    style={{ background: cardBg, border: `1px solid ${dividerColor}` }}
                  >
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-[14px] font-semibold leading-tight" style={{ color: tg.theme.text }}>
                        {line.title}
                      </p>
                      <button
                        onClick={() => removeLabor(idx)}
                        className="w-[36px] h-[36px] rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: chipBg }}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        value={line.qty}
                        onChange={(e) => updateLabor(idx, { qty: parseFloat(e.target.value) || 0 })}
                        className="w-[60px] h-[36px] px-2 rounded-lg text-[14px] font-bold tabular-nums text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                      />
                      <span className="text-[12px]" style={{ color: tg.theme.hint }}>{line.unit}</span>
                      <span className="text-[12px]" style={{ color: tg.theme.hint }}>×</span>
                      <input
                        type="number"
                        value={line.unit_price_eur}
                        onChange={(e) => updateLabor(idx, { unit_price_eur: parseFloat(e.target.value) || 0 })}
                        className="flex-1 h-[36px] px-2 rounded-lg text-[14px] font-semibold tabular-nums text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                      />
                      <span className="text-[12px]" style={{ color: tg.theme.hint }}>EUR =</span>
                      <span className="text-[15px] font-bold tabular-nums shrink-0" style={{ color: tg.theme.text }}>
                        {line.total_eur.toFixed(0)} EUR
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {LABOR_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => addLaborPreset(preset)}
                    className="px-3 py-2 rounded-xl text-[13px] font-semibold active:scale-95 transition-transform"
                    style={{
                      background: chipBg,
                      border: `1px solid ${chipBorder}`,
                      color: tg.theme.text,
                      minHeight: "40px",
                    }}
                  >
                    + {preset.title}
                    <span className="ml-1.5 text-[11px] opacity-70">{preset.unit_price_eur} EUR</span>
                  </button>
                ))}
                <button
                  onClick={() => setCustomLabor({ open: true, title: "", price: "" })}
                  className="px-3 py-2 rounded-xl text-[13px] font-semibold active:scale-95 transition-transform"
                  style={{
                    background: "transparent",
                    border: `1.5px dashed ${chipBorder}`,
                    color: tg.theme.hint,
                    minHeight: "40px",
                  }}
                >
                  + Друго…
                </button>
              </div>

              {/* Custom labor inline form */}
              {customLabor.open && (
                <div
                  className="rounded-xl p-3 mt-2"
                  style={{ background: cardBg, border: `1px solid ${dividerColor}` }}
                >
                  <input
                    autoFocus
                    type="text"
                    value={customLabor.title}
                    onChange={(e) => setCustomLabor({ ...customLabor, title: e.target.value })}
                    placeholder="Название работы"
                    className="w-full h-[40px] px-3 rounded-lg text-[14px] outline-none mb-2"
                    style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={customLabor.price}
                      onChange={(e) => setCustomLabor({ ...customLabor, price: e.target.value })}
                      placeholder="Цена EUR"
                      className="flex-1 h-[40px] px-3 rounded-lg text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                    />
                    <button
                      onClick={addLaborCustom}
                      className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
                      style={{ background: tg.theme.link }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setCustomLabor({ open: false, title: "", price: "" })}
                      className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
                      style={{ background: chipBg }}
                    >
                      <X className="w-5 h-5" style={{ color: tg.theme.hint }} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Bottom Actions (sticky) ─── */}
      <div
        className="shrink-0 px-3 pt-2"
        style={{
          background: tg.theme.bg,
          borderTop: `1px solid ${dividerColor}`,
          paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
        }}
      >
        {/* Row 1: Product selector + Voice button */}
        <div className="flex gap-2 mb-2">
          {hasCalc && (
            <button
              onClick={openProductSelector}
              disabled={saving}
              className="flex-1 h-[48px] rounded-xl text-[15px] font-bold transition-colors active:scale-[0.98]"
              style={{
                background: estimate.product_title ? chipBg : tg.theme.link,
                color: estimate.product_title ? tg.theme.text : "#fff",
                border: estimate.product_title ? `1px solid ${chipBorder}` : "none",
              }}
            >
              {estimate.product_title ? "Сменить кондиц." : "Выбрать кондиц."}
            </button>
          )}

          {/* Voice correction — prominent, always visible */}
          {voicePhase === "idle" && (
            <button
              onClick={startVoiceCorrection}
              className="w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0"
              style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
            >
              <Mic className="w-5 h-5" style={{ color: tg.theme.link }} />
            </button>
          )}
          {voicePhase === "recording" && (
            <button
              onClick={stopVoiceCorrection}
              className="h-[48px] px-4 rounded-xl flex items-center gap-2 shrink-0"
              style={{ background: "#ef4444" }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span className="text-[14px] font-bold text-white tabular-nums">{formatTime(voiceElapsed)}</span>
              <Square className="w-4 h-4 text-white fill-white" />
            </button>
          )}
          {voicePhase === "processing" && (
            <div className="h-[48px] px-4 rounded-xl flex items-center gap-2 shrink-0"
              style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
            >
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: tg.theme.link }} />
            </div>
          )}
        </div>

        {/* Row 2: PDF actions — only when product selected */}
        {hasCalc && estimate.product_title && (
          <div className="flex items-center gap-2 mb-1">
            {/* Lang pills */}
            <div className="flex gap-1 shrink-0">
              {(["bg", "en", "ru", "ua"] as PdfLang[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setPdfLang(lang); tg.haptic.select(); }}
                  className="w-[32px] h-[32px] rounded-lg text-[11px] font-bold uppercase flex items-center justify-center"
                  style={{
                    background: pdfLang === lang ? tg.theme.link : chipBg,
                    color: pdfLang === lang ? "#fff" : tg.theme.hint,
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* PDF buttons */}
            <button
              onClick={downloadPDF}
              disabled={pdfLoading}
              className="h-[36px] px-3 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold"
              style={{ background: "#16a34a", color: "#fff" }}
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              КП
            </button>
            <button
              onClick={sharePDF}
              disabled={pdfLoading}
              className="h-[36px] px-3 flex items-center gap-1.5 rounded-lg text-[13px] font-semibold"
              style={{ background: tg.theme.link, color: "#fff" }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ─── Equipment line modal (catalog / manual) ─── */}
      {equipmentModal !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEquipmentModal("closed");
              setPendingProduct(null);
              setEquipQuery("");
            }
          }}
        >
          <div className="flex-1" />
          <div
            className="rounded-t-2xl overflow-hidden flex flex-col"
            style={{ background: tg.theme.bg, maxHeight: "85vh" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: `1px solid ${dividerColor}` }}
            >
              <h2 className="text-[16px] font-bold" style={{ color: tg.theme.text }}>
                Добавить оборудование
              </h2>
              <button
                onClick={() => { setEquipmentModal("closed"); setPendingProduct(null); setEquipQuery(""); }}
                className="w-[44px] h-[44px] flex items-center justify-center -mr-2"
              >
                <X className="w-6 h-6" style={{ color: tg.theme.hint }} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 py-2 shrink-0">
              <button
                onClick={() => setEquipmentModal("catalog")}
                className="flex-1 h-[40px] rounded-lg text-[14px] font-semibold"
                style={{
                  background: equipmentModal === "catalog" ? tg.theme.link : chipBg,
                  color: equipmentModal === "catalog" ? "#fff" : tg.theme.text,
                }}
              >
                Из каталога
              </button>
              <button
                onClick={() => setEquipmentModal("manual")}
                className="flex-1 h-[40px] rounded-lg text-[14px] font-semibold"
                style={{
                  background: equipmentModal === "manual" ? tg.theme.link : chipBg,
                  color: equipmentModal === "manual" ? "#fff" : tg.theme.text,
                }}
              >
                Вручную
              </button>
            </div>

            {/* Catalog tab */}
            {equipmentModal === "catalog" && (
              <>
                <div className="px-4 pt-1 pb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tg.theme.hint }} />
                      <input
                        autoFocus
                        type="text"
                        value={equipQuery}
                        onChange={(e) => searchEquipment(e.target.value)}
                        placeholder="Daikin Sensira, 12k…"
                        className="w-full h-[44px] pl-9 pr-3 rounded-xl text-[14px] outline-none"
                        style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  {pendingProduct ? (
                    <div
                      className="rounded-xl p-3 mb-3"
                      style={{ background: cardBg, border: `1.5px solid ${tg.theme.link}` }}
                    >
                      <p className="text-[14px] font-bold mb-1" style={{ color: tg.theme.text }}>
                        {pendingProduct.manufacturer} {pendingProduct.title_override || pendingProduct.title}
                      </p>
                      <p className="text-[12px] mb-3" style={{ color: tg.theme.hint }}>
                        {pendingProduct.btu ? `${(pendingProduct.btu / 1000).toFixed(0)}K BTU · ` : ""}
                        {Number(pendingProduct.price_override ?? (pendingProduct.is_promo && pendingProduct.price_promo ? pendingProduct.price_promo : pendingProduct.price_client)).toFixed(0)} EUR
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px]" style={{ color: tg.theme.text }}>Кол-во:</span>
                        <button
                          onClick={() => setPendingQty(Math.max(1, pendingQty - 1))}
                          className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
                          style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
                        >
                          <Minus className="w-4 h-4" style={{ color: tg.theme.text }} />
                        </button>
                        <span className="text-[18px] font-bold tabular-nums w-[36px] text-center" style={{ color: tg.theme.text }}>
                          {pendingQty}
                        </span>
                        <button
                          onClick={() => setPendingQty(pendingQty + 1)}
                          className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
                          style={{ background: chipBg, border: `1px solid ${chipBorder}` }}
                        >
                          <Plus className="w-4 h-4" style={{ color: tg.theme.text }} />
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => addEquipmentFromProduct(pendingProduct, pendingQty)}
                          className="h-[40px] px-4 rounded-lg text-[14px] font-bold text-white"
                          style={{ background: tg.theme.link }}
                        >
                          Добавить
                        </button>
                      </div>
                    </div>
                  ) : equipSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: tg.theme.hint }} />
                    </div>
                  ) : equipResults.length === 0 ? (
                    <p className="text-center py-6 text-[14px]" style={{ color: tg.theme.hint }}>
                      {equipQuery ? "Ничего не найдено" : "Введите название модели"}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {equipResults.map((p) => {
                        const price = p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client);
                        return (
                          <button
                            key={p.id}
                            onClick={() => { setPendingProduct(p); setPendingQty(1); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left active:scale-[0.98]"
                            style={{ background: chipBg, border: `1px solid ${chipBorder}`, minHeight: "56px" }}
                          >
                            {p.gallery?.[0] ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.gallery[0]}
                                alt=""
                                className="w-12 h-12 rounded-lg object-contain shrink-0"
                                style={{ background: tg.theme.bgSecondary }}
                              />
                            ) : (
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: tg.theme.bgSecondary }}
                              >
                                <ImageOff className="w-4 h-4" style={{ color: tg.theme.hint }} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium leading-tight truncate" style={{ color: tg.theme.text }}>
                                {p.title_override || p.title}
                              </p>
                              <p className="text-[12px] mt-0.5" style={{ color: tg.theme.hint }}>
                                {p.manufacturer} {p.btu ? `/ ${(p.btu / 1000).toFixed(0)}K BTU` : ""}
                              </p>
                            </div>
                            <span className="text-[15px] font-bold shrink-0" style={{ color: tg.theme.text }}>
                              {Number(price).toFixed(0)} EUR
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Manual tab */}
            {equipmentModal === "manual" && (
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                <input
                  autoFocus
                  type="text"
                  value={manualEquip.manufacturer}
                  onChange={(e) => setManualEquip({ ...manualEquip, manufacturer: e.target.value })}
                  placeholder="Производитель (Daikin, Mitsubishi…)"
                  className="w-full h-[44px] px-3 rounded-xl text-[14px] outline-none"
                  style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                />
                <input
                  type="text"
                  value={manualEquip.title}
                  onChange={(e) => setManualEquip({ ...manualEquip, title: e.target.value })}
                  placeholder="Модель (Sensira FTXC25C)"
                  className="w-full h-[44px] px-3 rounded-xl text-[14px] outline-none"
                  style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={manualEquip.btu}
                    onChange={(e) => setManualEquip({ ...manualEquip, btu: e.target.value })}
                    placeholder="BTU (9000)"
                    className="flex-1 h-[44px] px-3 rounded-xl text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                  />
                  <input
                    type="number"
                    value={manualEquip.qty}
                    onChange={(e) => setManualEquip({ ...manualEquip, qty: e.target.value })}
                    placeholder="Кол-во"
                    className="w-[100px] h-[44px] px-3 rounded-xl text-[14px] text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                  />
                </div>
                <input
                  type="number"
                  value={manualEquip.price}
                  onChange={(e) => setManualEquip({ ...manualEquip, price: e.target.value })}
                  placeholder="Цена за единицу EUR"
                  className="w-full h-[44px] px-3 rounded-xl text-[14px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
                />
                <button
                  onClick={addEquipmentManual}
                  className="w-full h-[48px] rounded-xl text-[15px] font-bold text-white"
                  style={{ background: tg.theme.link }}
                >
                  Добавить позицию
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Product Selector Overlay ─── */}
      {showProducts && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowProducts(false); }}
        >
          <div className="flex-1" />
          <div
            className="rounded-t-2xl overflow-hidden flex flex-col"
            style={{
              background: tg.theme.bg,
              maxHeight: "80vh",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: `1px solid ${dividerColor}` }}
            >
              <h2 className="text-[16px] font-bold" style={{ color: tg.theme.text }}>
                Выбрать кондиционер
              </h2>
              <button
                onClick={() => setShowProducts(false)}
                className="w-[44px] h-[44px] flex items-center justify-center -mr-2"
              >
                <X className="w-6 h-6" style={{ color: tg.theme.hint }} />
              </button>
            </div>

            {/* BTU hint */}
            {estimate.recommended_btu && (
              <div className="px-4 py-2 shrink-0">
                <p className="text-[13px]" style={{ color: tg.theme.hint }}>
                  Рекомендовано: {(estimate.recommended_btu / 1000).toFixed(0)}K BTU
                </p>
              </div>
            )}

            {/* Products list */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: tg.theme.hint }} />
                </div>
              ) : products.length === 0 ? (
                <p className="text-center py-8 text-[14px]" style={{ color: tg.theme.hint }}>
                  Нет доступных моделей
                </p>
              ) : (
                <div className="space-y-2 mt-1">
                  {products.map((p) => {
                    const price = p.price_override ?? (p.is_promo && p.price_promo ? p.price_promo : p.price_client);
                    const isSelected = estimate.product_id === p.id;

                    return (
                      <button
                        key={p.id}
                        onClick={() => selectProduct(p)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left active:scale-[0.98] transition-transform"
                        style={{
                          background: isSelected ? `${tg.theme.link}15` : chipBg,
                          border: `1.5px solid ${isSelected ? tg.theme.link : chipBorder}`,
                          minHeight: "56px",
                        }}
                      >
                        {p.gallery?.[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.gallery[0]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-contain shrink-0"
                            style={{ background: tg.theme.bgSecondary }}
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: tg.theme.bgSecondary }}
                          >
                            <ImageOff className="w-4 h-4" style={{ color: tg.theme.hint }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium leading-tight truncate" style={{ color: tg.theme.text }}>
                            {p.title_override || p.title}
                          </p>
                          <p className="text-[12px] mt-0.5" style={{ color: tg.theme.hint }}>
                            {p.manufacturer} {p.btu ? `/ ${(p.btu / 1000).toFixed(0)}K BTU` : ""}
                          </p>
                        </div>
                        <span className="text-[16px] font-bold shrink-0" style={{ color: tg.theme.text }}>
                          {Number(price).toFixed(0)} EUR
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
