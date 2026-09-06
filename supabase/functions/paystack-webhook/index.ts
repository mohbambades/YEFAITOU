import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

async function hmacSha512(secret: string, payload: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  if (!PAYSTACK_SECRET_KEY) return new Response("Webhook not configured", { status: 503 });

  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const expected = await hmacSha512(PAYSTACK_SECRET_KEY, raw);
  if (!safeEqual(signature, expected)) return new Response("Invalid signature", { status: 401 });

  let event: any;
  try { event = JSON.parse(raw); } catch { return new Response("Invalid JSON", { status: 400 }); }
  if (event.event !== "charge.success") return new Response("OK", { status: 200 });

  const payment = event.data;
  const reference = payment?.reference;
  if (!reference || payment?.status !== "success") return new Response("OK", { status: 200 });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: intent, error: intentError } = await admin.from("payment_intents").select("*").eq("reference", reference).maybeSingle();
  if (intentError) return new Response("Database error", { status: 500 });
  if (!intent) return new Response("Unknown reference", { status: 200 });
  if (intent.status === "success") return new Response("OK", { status: 200 });

  const expectedAmount = Number(intent.amount_xof) * 100;
  if (Number(payment.amount) !== expectedAmount || payment.currency !== intent.currency) {
    await admin.from("payment_intents").update({ status: "failed", metadata: { ...intent.metadata, rejection: "amount_or_currency_mismatch", received_amount: payment.amount, received_currency: payment.currency } }).eq("reference", reference);
    return new Response("Payment mismatch", { status: 400 });
  }

  const { error: grantError } = await admin.rpc("grant_credits", {
    p_user_id: intent.user_id,
    p_amount: intent.credits,
    p_description: `Achat ${intent.plan_id} via Paystack`,
    p_reference_id: reference,
  });
  if (grantError) return new Response("Credit grant failed", { status: 500 });

  const { error: updateError } = await admin.from("payment_intents").update({ status: "success", provider_transaction_id: String(payment.id ?? ""), paid_at: payment.paid_at ?? new Date().toISOString() }).eq("reference", reference);
  if (updateError) return new Response("Payment update failed", { status: 500 });

  return new Response("OK", { status: 200 });
});
