import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { transcribeAudio } from "../../../../../lib/estimates/transcribe";
import { extractParams } from "../../../../../lib/estimates/extract-params";
import { calculateEstimate } from "../../../../../lib/estimates/calculate";

export const maxDuration = 60;

/** POST /api/tg/estimates/transcribe — upload audio, get transcript + params + calculation */
export const POST = withTgAuth(async (req) => {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File | null;
  const language = (formData.get("language") as string) || "ru";

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file" }, { status: 400 });
  }

  // Convert to buffer
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length < 100) {
    return NextResponse.json({ error: "Audio too short" }, { status: 400 });
  }

  if (buffer.length > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Audio too large (max 25MB)" }, { status: 400 });
  }

  // 1. Transcribe
  const transcript = await transcribeAudio(buffer, audioFile.name || "audio.webm", language);

  if (!transcript || transcript.length < 5) {
    return NextResponse.json({ error: "Could not transcribe audio" }, { status: 422 });
  }

  // 2. Extract params
  const params = await extractParams(transcript);

  // 3. Calculate
  const calculation = calculateEstimate(params);

  return NextResponse.json({
    transcript,
    params,
    calculation,
  });
});
