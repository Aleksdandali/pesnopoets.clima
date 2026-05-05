"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniApp } from "../TgShell";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import Link from "next/link";
import { Loader2, Plus, FileText, ChevronRight } from "lucide-react";

interface Estimate {
  id: number;
  client_name: string | null;
  client_phone: string | null;
  area_m2: number | null;
  recommended_btu: number | null;
  total_install_bgn: number | null;
  product_title: string | null;
  product_price_eur: number | null;
  status: string;
  created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  draft: "#b45309",
  sent: "#0284c7",
  accepted: "#15803d",
  rejected: "#b91c1c",
  expired: "#64748b",
};
const STATUS_LABEL: Record<string, string> = {
  draft: "Черновик",
  sent: "Отправлено",
  accepted: "Принято",
  rejected: "Отклонено",
  expired: "Истекло",
};

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "сейчас";
  if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

export default function TgEstimatesPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = (await fetch("/api/tg/estimates?page=1")) as { estimates: Estimate[] };
      setEstimates(data.estimates);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="px-4 pt-5 pb-3 flex items-center justify-between" style={{ background: tg.theme.bg }}>
        <div>
          <h1 className="text-[20px] font-bold" style={{ color: tg.theme.text }}>Просчёты</h1>
          <p className="text-[13px]" style={{ color: tg.theme.hint }}>Коммерческие предложения</p>
        </div>
        <Link
          href="/tg/estimates/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
          style={{ background: tg.theme.link, color: "#fff" }}
          onClick={() => tg.haptic.medium()}
        >
          <Plus className="w-4 h-4" />
          Новый
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
        </div>
      ) : estimates.length === 0 ? (
        <div className="text-center py-16 px-6">
          <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: tg.theme.hint }} />
          <p className="text-[15px] font-medium mb-1" style={{ color: tg.theme.text }}>Пока нет просчётов</p>
          <p className="text-[13px]" style={{ color: tg.theme.hint }}>Отправьте голосовое боту или нажмите "Новый"</p>
        </div>
      ) : (
        <div className="px-4 mt-2 space-y-2.5">
          {estimates.map((est) => {
            const totalBgn = est.total_install_bgn || 0;
            const productBgn = est.product_price_eur ? Math.round(est.product_price_eur * 1.95583) : 0;
            const grandTotal = totalBgn + productBgn;

            return (
              <Link
                key={est.id}
                href={`/tg/estimates/${est.id}`}
                className="block rounded-2xl p-4 active:scale-[0.98] transition-transform"
                style={{ background: tg.theme.bg }}
                onClick={() => tg.haptic.light()}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold" style={{ color: tg.theme.text }}>
                      #{est.id} {est.client_name || "Без имени"}
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: tg.theme.hint }}>
                      {est.area_m2 ? `${est.area_m2}м²` : ""}
                      {est.recommended_btu ? ` · ${(est.recommended_btu / 1000).toFixed(0)}K BTU` : ""}
                      {est.product_title ? ` · ${est.product_title.slice(0, 25)}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-[15px] font-bold" style={{ color: tg.theme.text }}>
                        {grandTotal > 0 ? `${grandTotal} лв` : "—"}
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[est.status] }} />
                        <span className="text-[10px] font-medium" style={{ color: STATUS_COLOR[est.status] }}>
                          {STATUS_LABEL[est.status]}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: `${tg.theme.hint}40` }} />
                  </div>
                </div>
                <p className="text-[10px] mt-2" style={{ color: tg.theme.hint }}>{timeAgo(est.created_at)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
