import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInquiryNotification } from "@/lib/telegram";
import {
  checkRateLimit,
  sanitizeInput,
  isValidPhone,
  isValidEmail,
} from "@/lib/security";

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface CartItemPayload {
  id: number;
  title: string;
  manufacturer: string;
  quantity: number;
  priceEur: number;
  priceBgn: number;
  btu?: number | null;
}

/**
 * POST /api/cart-inquiry — handles a full cart checkout as an inquiry.
 * No online payment is taken; the manager calls back to confirm.
 * Persisted into the existing `inquiries` table with a cart summary in `message`.
 */
export async function POST(request: Request) {
  const rateLimit = await checkRateLimit();
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();

    const name = sanitizeInput(body.name || "", 100);
    const phone = sanitizeInput(body.phone || "", 20);
    const email = body.email ? sanitizeInput(body.email, 200) : null;
    const comment = body.comment ? sanitizeInput(body.comment, 1000) : "";
    const locale = ["bg", "en", "ru", "ua"].includes(body.locale) ? body.locale : "bg";

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items: CartItemPayload[] = rawItems
      .filter(
        (x: unknown): x is CartItemPayload =>
          !!x &&
          typeof x === "object" &&
          typeof (x as CartItemPayload).id === "number" &&
          typeof (x as CartItemPayload).quantity === "number"
      )
      .slice(0, 50); // hard cap

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Name is required (min 2 characters)" },
        { status: 400 }
      );
    }
    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotalBgn = Number.isFinite(body.subtotalBgn)
      ? Number(body.subtotalBgn)
      : items.reduce((sum, i) => sum + (i.priceBgn || 0) * (i.quantity || 0), 0);

    // Build a human-readable cart summary for the `message` column + Telegram
    const itemsSummary = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${sanitizeInput(i.manufacturer || "", 60)} — ${sanitizeInput(
            i.title || "",
            180
          )} × ${i.quantity} = ${Math.round((i.priceBgn || 0) * i.quantity)} лв.`
      )
      .join("\n");

    const summary =
      `${itemsSummary}\n\n` +
      `Total: ${Math.round(subtotalBgn)} лв.` +
      (comment ? `\n\nComment: ${comment}` : "");

    // Insert inquiry — link the first product_id (if any) to the inquiry row.
    const firstProductId = items[0]?.id ?? null;
    const messageForDb = sanitizeInput(summary, 1000);

    const supabase = createAnonClient();
    const { error } = await supabase.from("inquiries").insert({
      product_id: firstProductId,
      name,
      phone,
      email,
      message: messageForDb,
      locale,
      source: "checkout",
      status: "new",
    });

    if (error) {
      console.error("Failed to insert cart inquiry:", error);
      return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
    }

    // Telegram — richer summary than DB (not size-limited the same way, but keep reasonable).
    const tgTitle =
      items.length === 1
        ? `${items[0].manufacturer} — ${items[0].title}`
        : `Cart (${items.length} items)`;
    sendInquiryNotification({
      name,
      phone,
      email,
      message: summary,
      productTitle: tgTitle,
      productPrice: Math.round(subtotalBgn),
      locale,
    }).catch((err) => console.error("Telegram notification failed:", err));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Cart inquiry API error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
