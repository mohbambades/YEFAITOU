import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
const APP_URL = Deno.env.get("APP_URL");

const PLANS = {
  starter: { credits: 5000, amount: 5000 },
  growth: { credits: 20000, amount: 15000 },
  scale: { credits: 60000, amount: 40000 },
} as const;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);
  if (!PAYSTACK_SECRET_KEY || !SERVICE_ROLE_KEY || !APP_URL) {
    return json({ error: "PAYMENT_NOT_CONFIGURED" }, 503);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "UNAUTHENTICATED" }, 401);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: "UNAUTHENTICATED" }, 401);
  if (!user.email) return json({ error: "EMAIL_REQUIRED" }, 400);

  let body: { planId?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "INVALID_JSON" }, 400);
  }

  const planId = body.planId as keyof typeof PLANS | undefined;
  const plan = planId ? PLANS[planId] : undefined;
  if (!plan) return json({ error: "INVALID_PLAN" }, 400);

  const reference = `YF_${crypto.randomUUID().replaceAll("-", "")}`;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { error: insertError } = await admin.from("payment_intents").insert({
    user_id: user.id,
    plan_id: planId,
    credits: plan.credits,
    amount_xof: plan.amount,
    reference,
    metadata: { product: "YEFAITOU credits", plan_id: planId },
  });
  if (insertError) return json({ error: "PAYMENT_INTENT_CREATE_FAILED" }, 500);

  // XOF has no fractional subunit in Paystack: 5,000 FCFA is sent as 5000.
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: String(plan.amount),
      currency: "XOF",
      reference,
      channels: ["card", "mobile_money"],
      callback_url: `${APP_URL.replace(/\/$/, "")}/wallet?payment=return&reference=${encodeURIComponent(reference)}`,
      metadata: { user_id: user.id, plan_id: planId, credits: plan.credits },
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.status || !result.data?.authorization_url) {
    await admin.from("payment_intents").update({ status: "failed" }).eq("reference", reference);
    return json({ error: "PAYSTACK_INITIALIZATION_FAILED" }, 502);
  }

  return json({ authorization_url: result.data.authorization_url, reference });
});
