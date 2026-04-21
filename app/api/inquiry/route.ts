import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use anon key (not service role) — RLS allows anon INSERT on inquiries + SELECT on products
function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
import { sendInquiryNotification } from "@/lib/telegram";
import {
  checkRateLimit,
  sanitizeInput,
  isValidPhone,
  isValidEmail,
} from "@/lib/security";

export async function POST(request: Request) {
  // CSRF: reject requests from foreign origins
  const origin = request.headers.get("origin");
  if (origin && !origin.includes("pesnopoets")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limiting
  const rateLimit = await checkRateLimit();
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const name = sanitizeInput(body.name || "", 100);
    const phone = sanitizeInput(body.phone || "", 20);
    const email = body.email ? sanitizeInput(body.email, 200) : null;
    const message = body.message ? sanitizeInput(body.message, 1000) : null;
    const productId = body.product_id ? Number(body.product_id) : null;
    const locale = ["bg", "en", "ru", "ua"].includes(body.locale)
      ? body.locale
      : "bg";

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
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createAnonClient();

    // Get product title for notification
    let productTitle = null;
    let productPrice = null;
    if (productId) {
      const { data: product } = await supabase
        .from("products")
        .select("title, title_override, price_client, price_override")
        .eq("id", productId)
        .single();
      if (product) {
        productTitle = product.title_override || product.title;
        productPrice = product.price_override || product.price_client;
      }
    }

    // Insert inquiry
    const { data: inquiry, error } = await supabase
      .from("inquiries")
      .insert({
        product_id: productId,
        name,
        phone,
        email,
        message,
        locale,
        source: ["one-click", "one-click-card", "inquiry-page", "product-page"].includes(body.source) ? body.source : null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to insert inquiry:", error);
      return NextResponse.json(
        { error: "Failed to submit inquiry" },
        { status: 500 }
      );
    }

    // Send Telegram notification (non-blocking)
    sendInquiryNotification({
      name,
      phone,
      email,
      message,
      productTitle,
      productPrice,
      locale,
    }).catch((err) =>
      console.error("Telegram notification failed:", err)
    );

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Inquiry API error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
