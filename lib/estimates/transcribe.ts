/**
 * Speech-to-text via Groq (Whisper large-v3).
 * Free tier, fast, excellent Russian/Bulgarian support.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string = "audio.ogg",
  language?: string,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  // Build multipart form data manually (Node.js native)
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: "audio/ogg" });
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("model", "whisper-large-v3");
  if (language) {
    formData.append("language", language);
  }
  formData.append("response_format", "text");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Groq STT error:", res.status, err);
    throw new Error(`Transcription failed: ${res.status}`);
  }

  const text = await res.text();
  return text.trim();
}

/**
 * Download a Telegram voice message file.
 */
export async function downloadTelegramFile(fileId: string): Promise<Buffer> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");

  // Get file path
  const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
  const fileData = (await fileRes.json()) as { ok: boolean; result?: { file_path: string } };
  if (!fileData.ok || !fileData.result?.file_path) {
    throw new Error("Failed to get file path from Telegram");
  }

  // Download file
  const downloadUrl = `https://api.telegram.org/file/bot${token}/${fileData.result.file_path}`;
  const downloadRes = await fetch(downloadUrl);
  if (!downloadRes.ok) {
    throw new Error("Failed to download file from Telegram");
  }

  const arrayBuffer = await downloadRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
