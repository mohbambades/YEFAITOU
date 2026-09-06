import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const APP_URL = Deno.env.get("APP_URL") || "http://localhost:3000";

const PLANS = {
  starter: { credits: 5000, amount: 5000 },
  growth: { credits: 20000, amount: 15000 },
  scale: { credits: 60000, amount: 40000 },
} as const;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405, headers: cors });
  if (!PAYSTACK_SECRET_KEY) return new Response(JSON.stringify({ error: "PAYSTACK_NOT_CONFIGURED" }), { status: 503, headers: cors });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401, headers: cors });

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401, headers: cors });

  let body: { planId?: string };
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "INVALID_JSON" }), { status: 400, headers: cors }); }
  const plan = body.planId ? PLANS[body.planId as keyof typeof PLANS] : undefined;
  if (!plan) return new Response(JSON.stringify({ error: "INVALID_PLAN" }), { status: 400, headers: cors });
  if (!user.email) return new Response(JSON.stringify({ error: "EMAIL_REQUIRED" }), { status: 400, headers: cors });

  const reference = `YF_${crypto.randomUUID().replaceAll("-", "")}`;
  const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error: insertError } = await admin.from("payment_intents").insert({
    user_id: user.id,
    plan_id: body.planId,
    credits: plan.credits,
    amount_xof: plan.amount,
    reference,
    metadata: { product: "YEFAITOU credits", plan_id: body.planId },
  });
  if (insertError) return new Response(JSON.stringify({ error: "PAYMENT_INTENT_CREATE_FAILED" }), { status: 500, headers: cors });

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      amount: String(plan.amount * 100),
      currency: "XOF",
      reference,
      channels: ["card", "mobile_money"],
      callback_url: `${APP_URL}/wallet?payment=return&reference=${encodeURIComponent(reference)}`,
      metadata: { user_id: user.id, plan_id: body.planId, credits: plan.credits },
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.status) {
    await admin.from("payment_intents").update({ status: "failed" }).eq("reference", reference);
    return new Response(JSON.stringify({ error: "PAYSTACK_INITIALIZATION_FAILED" }), { status: 502, headers: cors });
  }

  return new Response(JSON.stringify({ authorization_url: result.data.authorization_url, reference }), { status: 200, headers: cors });
});
