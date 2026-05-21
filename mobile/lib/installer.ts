import { supabase } from "./supabase";

const BUCKET = "installations";

export type PhotoKind = "indoor" | "outdoor" | "label" | "extra";

/**
 * Upload a local image (file://...) to the installations bucket
 * under the deterministic path {clientHint}/{installationId}/{kind}.jpg.
 *
 * We use the installation UUID before the row exists so the upload can happen
 * BEFORE the DB row — if the installer abandons the form, orphan photos can
 * be cleaned by a periodic job that diffs storage paths vs installations rows.
 */
export async function uploadInstallationPhoto(args: {
  localUri: string;
  installationId: string;
  kind: PhotoKind;
  index?: number; // for extras: 0..N
}): Promise<string> {
  const { localUri, installationId, kind, index } = args;
  const filename = kind === "extra" ? `extra-${index ?? 0}.jpg` : `${kind}.jpg`;
  // Folder convention: {installation_id}/... — client_id isn't known yet at
  // upload time. The storage RLS read policy (fixed in migration 019) joins
  // through the installations table to resolve client ownership.
  const path = `${installationId}/${filename}`;

  // RN-safe upload: convert local URI to ArrayBuffer.
  const arrayBuffer = await fetch(localUri).then((r) => r.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });

  if (error) throw error;
  return path;
}

export interface CreateInstallationInput {
  installationId: string; // UUID generated client-side
  phone: string;
  clientName?: string;
  brand: string;
  model: string;
  serial?: string;
  btu?: number;
  address?: string;
  lat?: number;
  lng?: number;
  installDate?: string; // YYYY-MM-DD
  warrantyMonths?: number;
  notes?: string;
  indoorPhotoPath: string;
  outdoorPhotoPath: string;
  labelPhotoPath: string;
  extraPhotoPaths?: string[];
}

export async function createInstallation(input: CreateInstallationInput): Promise<string> {
  const { data, error } = await supabase.rpc("installer_create_installation", {
    p_installation_id: input.installationId,
    p_phone: input.phone,
    p_client_name: input.clientName ?? null,
    p_brand: input.brand,
    p_model: input.model,
    p_serial: input.serial ?? null,
    p_btu: input.btu ?? null,
    p_address: input.address ?? null,
    p_lat: input.lat ?? null,
    p_lng: input.lng ?? null,
    p_install_date: input.installDate ?? null,
    p_warranty_months: input.warrantyMonths ?? null,
    p_notes: input.notes ?? null,
    p_indoor_photo_path: input.indoorPhotoPath,
    p_outdoor_photo_path: input.outdoorPhotoPath,
    p_label_photo_path: input.labelPhotoPath,
    p_extra_photo_paths: input.extraPhotoPaths ?? [],
  });

  if (error) throw error;
  return data as string;
}

/**
 * Crockford-ish UUID v4 via crypto.getRandomValues if available, else a
 * fallback for environments without crypto (Hermes does expose it).
 */
export function generateUuid(): string {
  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
