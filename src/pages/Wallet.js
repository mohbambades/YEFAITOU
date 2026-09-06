import React, { useState } from "react";
import { useCredits } from "../context/CreditContext";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, X, Loader2 } from "lucide-react";

const PRICING_PLANS = [
  { id: "starter", name: "Starter", credits: 5000, price: "5 000", currency: "FCFA", color: "from-blue-500 to-cyan-400" },
  { id: "growth", name: "Growth", credits: 20000, price: "15 000", currency: "FCFA", color: "from-emerald-500 to-teal-400" },
  { id: "scale", name: "Scale", credits: 60000, price: "40 000", currency: "FCFA", color: "from-indigo-600 to-purple-500" },
];

const Wallet = () => {
  const { balance, transactions, loading, refreshCredits } = useCredits();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const startPayment = async () => {
    if (!selectedPlan || paying) return;
    setPaying(true);
    setPaymentError("");

    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: { planId: selectedPlan.id },
      });

      if (error) throw error;
      if (!data?.authorization_url) throw new Error("URL de paiement indisponible.");

      window.location.assign(data.authorization_url);
    } catch (error) {
      console.error("Erreur initialisation paiement:", error);
      setPaymentError("Impossible d'initialiser le paiement. Vérifiez votre connexion et réessayez.");
      setPaying(false);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "return") refreshCredits();
  }, [refreshCredits]);

  return (
    <div className="min-h-full p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 md:mb-12">
        <div className="breadcrumbs text-sm mb-3"><ul><li>YEFAITOU</li><li>Wallet</li></ul></div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t("wallet.title")}</h1>
        <p className="text-base-content/60 mt-2">{t("wallet.sub")}</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
            <div className="card-body relative">
              <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-success/10 blur-2xl" />
              <div className="flex items-center gap-2 text-base-content/60 text-xs uppercase tracking-widest font-bold">
                <WalletIcon size={15} /> Solde disponible
              </div>
              <div className="text-5xl md:text-6xl font-black tracking-tighter my-4">
                {loading ? <span className="loading loading-dots loading-md" /> : balance.toLocaleString("fr-FR")}
              </div>
              <div className="badge badge-success badge-outline mb-5">Crédits YEFAITOU</div>
              <button className="btn btn-success btn-lg w-full" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                Recharger mon compte
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-8">
          <section id="pricing">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-xl font-black">Packs de crédits</h2>
                <p className="text-sm text-base-content/60 mt-1">Choisissez le volume adapté à vos campagnes.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan) => (
                <div key={plan.id} className="card bg-base-100 border border-base-300 hover:border-success shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => { setSelectedPlan(plan); setPaymentError(""); }}>
                  <div className="card-body p-5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} shadow-lg`} />
                    <h3 className="card-title mt-2">{plan.name}</h3>
                    <div className="text-2xl font-black">{plan.credits.toLocaleString("fr-FR")}</div>
                    <p className="text-sm text-base-content/60">crédits</p>
                    <div className="divider my-1" />
                    <p className="font-black text-lg">{plan.price} {plan.currency}</p>
                    <button className="btn btn-outline btn-success btn-sm mt-2">Choisir</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-0">
              <div className="p-5 border-b border-base-300">
                <h2 className="font-black">{t("wallet.history")}</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-success" /></div>
              ) : transactions.length === 0 ? (
                <div className="alert m-5">Aucune transaction pour le moment.</div>
              ) : (
                <div className="divide-y divide-base-300">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex justify-between items-center gap-4 hover:bg-base-200/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`avatar placeholder ${tx.amount > 0 ? "text-success" : "text-base-content/50"}`}>
                          <div className="w-10 rounded-full bg-base-200">
                            {tx.amount > 0 ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{tx.description}</p>
                          <p className="text-xs text-base-content/50">{tx.date}</p>
                        </div>
                      </div>
                      <span className={`font-black whitespace-nowrap ${tx.amount > 0 ? "text-success" : "text-base-content/60"}`}>
                        {tx.amount > 0 ? `+${tx.amount.toLocaleString("fr-FR")}` : tx.amount.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {selectedPlan && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={() => setSelectedPlan(null)} disabled={paying}><X size={16} /></button>
            <h3 className="font-black text-2xl">{selectedPlan.name}</h3>
            <p className="py-4 text-base-content/60">Vous avez sélectionné {selectedPlan.credits.toLocaleString("fr-FR")} crédits pour {selectedPlan.price} {selectedPlan.currency}.</p>
            <div className="alert alert-info text-sm">Paiement sécurisé par Paystack. Vous pouvez payer par carte Visa/Mastercard ou mobile money selon les options disponibles.</div>
            {paymentError && <div className="alert alert-error text-sm mt-3">{paymentError}</div>}
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedPlan(null)} disabled={paying}>Fermer</button>
              <button className="btn btn-success" onClick={startPayment} disabled={paying}>
                {paying ? <><Loader2 size={16} className="animate-spin" /> Redirection…</> : "Payer maintenant"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !paying && setSelectedPlan(null)} />
        </dialog>
      )}
    </div>
  );
};

export default Wallet;
