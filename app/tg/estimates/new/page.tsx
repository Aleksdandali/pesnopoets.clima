"use client";

import { useState, useRef } from "react";
import { useMiniApp } from "../../TgShell";
import { useTelegram } from "../../../../telegram-miniapp/hooks/useTelegram";
import { useRouter } from "next/navigation";
import { Mic, Square, Loader2 } from "lucide-react";

type Phase = "idle" | "recording" | "processing";

export default function TgNewEstimatePage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timer.current);

        const blob = new Blob(chunks.current, { type: "audio/webm" });
        if (blob.size < 500) {
          setPhase("idle");
          setError("Слишком короткая запись");
          return;
        }

        setPhase("processing");
        tg.haptic.medium();

        try {
          // 1. Transcribe + extract params + calculate
          const { getToken } = await import("../../../../telegram-miniapp/lib/api");
          const token = getToken();

          const formData = new FormData();
          formData.append("audio", blob, "voice.webm");

          const transcribeRes = await window.fetch("/api/tg/estimates/transcribe", {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });

          if (!transcribeRes.ok) {
            const errData = await transcribeRes.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${transcribeRes.status}`);
          }

          const { transcript, params, calculation } = await transcribeRes.json();

          // 2. Create estimate with extracted data
          const createRes = (await fetch("/api/tg/estimates", {
            method: "POST",
            body: JSON.stringify({ transcript, params, calculation }),
          })) as { id: number };

          tg.haptic.success();
          router.replace(`/tg/estimates/${createRes.id}`);
        } catch (err) {
          tg.haptic.error();
          setError("Ошибка обработки. Попробуйте ещё раз.");
          setPhase("idle");
        }
      };

      mediaRecorder.current = recorder;
      recorder.start(250);
      setPhase("recording");
      setElapsed(0);
      tg.haptic.medium();
      timer.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } catch {
      tg.haptic.error();
      setError("Нет доступа к микрофону");
      setPhase("idle");
    }
  }

  function stopRecording() {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {phase === "processing" ? (
        <div className="text-center">
          <Loader2
            className="w-16 h-16 animate-spin mx-auto mb-4"
            style={{ color: tg.theme.link }}
          />
          <p className="text-[16px] font-semibold" style={{ color: tg.theme.text }}>
            Обрабатываю запись...
          </p>
          <p className="text-[14px] mt-1" style={{ color: tg.theme.hint }}>
            Расшифровка и расчёт
          </p>
        </div>
      ) : (
        <div className="text-center">
          {/* Mic button — large for one-handed use */}
          <button
            onClick={phase === "recording" ? stopRecording : startRecording}
            className="w-[96px] h-[96px] rounded-full flex items-center justify-center mx-auto mb-5 transition-transform active:scale-90"
            style={{
              background: phase === "recording" ? "#ef4444" : tg.theme.link,
              boxShadow: phase === "recording"
                ? "0 0 0 6px rgba(239,68,68,0.2)"
                : `0 0 0 6px ${tg.theme.link}30`,
            }}
          >
            {phase === "recording" ? (
              <Square className="w-8 h-8 text-white fill-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>

          {/* Recording indicator */}
          {phase === "recording" && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: "#ef4444" }}
              />
              <span
                className="text-[20px] font-bold tabular-nums"
                style={{ color: "#ef4444" }}
              >
                {formatTime(elapsed)}
              </span>
            </div>
          )}

          {/* Instruction text */}
          {phase === "idle" && (
            <>
              <p
                className="text-[17px] font-semibold mb-3"
                style={{ color: tg.theme.text }}
              >
                Нажмите для записи
              </p>
              <p
                className="text-[14px] leading-relaxed max-w-[300px] mx-auto"
                style={{ color: tg.theme.hint }}
              >
                Пример: 25 кв.м., юг, панелка, 4-й этаж, трасса 5м, наружный на балкон
              </p>
            </>
          )}

          {phase === "recording" && (
            <p className="text-[15px] font-medium" style={{ color: tg.theme.hint }}>
              Нажмите для остановки
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-[14px] font-medium mt-4" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
