/**
 * Mirrors enums/columns from supabase/migrations/018_mobile_app_schema.sql.
 * Keep in sync when the migration changes.
 */

export type UserRole = "client" | "installer" | "manager" | "admin";

export interface Profile {
  id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  language: "bg" | "en" | "ru" | "ua";
  client_id: number | null;
  expo_push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Installation {
  id: string;
  client_id: number;
  installer_user_id: string | null;
  brand: string;
  model: string;
  serial: string | null;
  btu: number | null;
  indoor_photo_path: string | null;
  outdoor_photo_path: string | null;
  label_photo_path: string | null;
  extra_photo_paths: string[];
  address: string | null;
  lat: number | null;
  lng: number | null;
  install_date: string;
  warranty_months: number;
  next_service_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  client_user_id: string;
  assigned_to: string | null;
  status: "open" | "closed";
  last_message_at: string;
  unread_count_staff: number;
  unread_count_client: number;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string | null;
  body: string;
  attachments: Array<{ url: string; kind: "image" | "file" }>;
  is_ai: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ServiceJob {
  id: string;
  installation_id: string;
  type: "maintenance" | "repair";
  scheduled_at: string | null;
  status: "requested" | "scheduled" | "in_progress" | "done" | "cancelled";
  assignee_user_id: string | null;
  completed_at: string | null;
  work_done: string | null;
  price_eur: number | null;
  created_at: string;
  updated_at: string;
}
