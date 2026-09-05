import React, { useState } from "react";
import { useCredits } from "../context/CreditContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Wallet as WalletIcon,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    credits: 5000,
    price: "5 000",
    currency: "FCFA",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "growth",
    name: "Growth",
    credits: 20000,
    price: "15 000",
    currency: "FCFA",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "scale",
    name: "Scale",
    credits: 60000,
    price: "40 000",
    currency: "FCFA",
    color: "from-indigo-600 to-purple-500",
  },
];

const Wallet = () => {
  const { balance, transactions, addCredits } = useCredits();
  const { t } = useLanguage();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      addCredits(selectedPlan.credits);
      setPaymentStatus("success");
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentStatus("idle");
        setSelectedPlan(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-black text- dark:text-white tracking-tight mb-2">
          {t("wallet.title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {t("wallet.sub")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg- dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">
                <WalletIcon size={14} /> Solde Disponible
              </div>
              <h2 className="text-6xl font-black text- dark:text-white mb-8 tracking-tighter">
                {balance}
              </h2>
              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all transform hover:scale-105"
              >
                {t("wallet.recharge")}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <section id="pricing">
            <h3 className="text-xl font-bold text- dark:text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>{" "}
              Packs de Crédits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 bg- dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-emerald-500 transition-all cursor-pointer group backdrop-blur-md shadow-sm dark:shadow-none"
                  onClick={() => handleSelectPlan(plan)}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} mb-4 shadow-lg`}
                  ></div>
                  <h4 className="text- dark:text-white font-bold text-lg mb-1">
                    {plan.name}
                  </h4>
                  <p className="text-2xl font-black text-slate- dark:text-white mb-4">
                    {plan.credits}
                  </p>
                  <p className="text-slate-400 dark:text-slate-400 text-sm mb-6">
                    {plan.price} {plan.currency}
                  </p>
                  <button className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 font-bold transition-all text-sm">
                    Choisir
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="bg- dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate dark:bg-slate-900/60">
              <h3 className="font-bold text- dark:text-white">
                {t("wallet.history")}
              </h3>
            </div>
            <div className="divide-y divide-slate-500 dark:divide-slate-800">
              {transactions &&
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                          tx.amount > 0
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownCircle size={18} />
                        ) : (
                          <ArrowUpCircle size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-200">
                          {tx.description}
                        </p>
                        <p className="text-[10px] text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                    <div
                      className={`font-black ${
                        tx.amount > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-400"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Confirmation
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-10 text-center">
              {paymentStatus === "idle" && (
                <>
                  <div className="text-5xl mb-6">💎</div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {selectedPlan?.credits} Crédits
                  </h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xl mb-8">
                    {selectedPlan?.price} {selectedPlan?.currency}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={simulatePayment}
                      className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold transition-all hover:border-emerald-500"
                    >
                      Mobile Money
                    </button>
                    <button
                      onClick={simulatePayment}
                      className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold transition-all hover:border-emerald-500"
                    >
                      Carte Visa
                    </button>
                  </div>
                </>
              )}
              {paymentStatus === "processing" && (
                <div className="py-10">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Traitement sécurisé...
                  </p>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="py-10 animate-in zoom-in">
                  <div className="text-6xl mb-4">🎉</div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Paiement Réussi !
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">
                    Vos crédits sont disponibles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
