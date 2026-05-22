import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
      "Add them to mobile/.env (see mobile/README.md).",
  );
}

// SecureStore stores per-key payloads in the iOS Keychain / Android Keystore
// with a ~2KB-per-value limit. Supabase session JSON can exceed that, so we
// split values into chunks. Index entry "chunked:<count>" tells getItem how
// many chunks to stitch back together.
const CHUNK_SIZE = 1800;
const CHUNK_PREFIX = "chunked:";

const SecureChunkedStorage = {
  async getItem(key: string): Promise<string | null> {
    const head = await SecureStore.getItemAsync(key);
    if (head === null) return null;
    if (!head.startsWith(CHUNK_PREFIX)) return head;
    const count = Number.parseInt(head.slice(CHUNK_PREFIX.length), 10);
    if (!Number.isFinite(count) || count <= 0) return null;
    const parts: string[] = [];
    for (let i = 0; i < count; i++) {
      const part = await SecureStore.getItemAsync(`${key}_${i}`);
      if (part === null) return null;
      parts.push(part);
    }
    return parts.join("");
  },
  async setItem(key: string, value: string): Promise<void> {
    // Clear any previous chunk fan-out under this key.
    const prev = await SecureStore.getItemAsync(key);
    if (prev !== null && prev.startsWith(CHUNK_PREFIX)) {
      const prevCount = Number.parseInt(prev.slice(CHUNK_PREFIX.length), 10);
      if (Number.isFinite(prevCount)) {
        for (let i = 0; i < prevCount; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
      }
    }
    if (value.length <= CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i] ?? "";
      await SecureStore.setItemAsync(`${key}_${i}`, chunk);
    }
    await SecureStore.setItemAsync(key, `${CHUNK_PREFIX}${chunks.length}`);
  },
  async removeItem(key: string): Promise<void> {
    const head = await SecureStore.getItemAsync(key);
    if (head !== null && head.startsWith(CHUNK_PREFIX)) {
      const count = Number.parseInt(head.slice(CHUNK_PREFIX.length), 10);
      if (Number.isFinite(count)) {
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
      }
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureChunkedStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
