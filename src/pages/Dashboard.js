import React from "react";
import { useCredits } from "../context/CreditContext";
import { useLanguage } from "../context/LanguageContext";
import { TrendingUp, Activity, Zap } from "lucide-react";

const Dashboard = () => {
  const { balance } = useCredits();
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          {/* TITRE PRINCIPAL : Blanc pur en mode sombre, Noir profond en mode clair */}
          <h1 className="text-4xl font-black text- dark:text-white tracking-tight mb-2">
            {t("dashboard.title")}
          </h1>
          <p className="text- dark:text-white font-light">
            {t("dashboard.sub")}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Système Opérationnel
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-8 bg- dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-emerald-500 transition-all shadow-sm dark:shadow-none backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6">
            <TrendingUp size={16} />
            <p className="text-xs uppercase tracking-widest font-bold">
              {t("dashboard.balance")}
            </p>
          </div>
          <h2 className="text-6xl font-black text- dark:text-white mb-4 tracking-tighter">
            {balance}
          </h2>
          <div className="mt-8 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-1000"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-medium">
            Utilisation : 65% de votre pack
          </p>
        </div>

        <div className="md:col-span-2 p-8 bg- dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-all shadow-sm dark:shadow-none backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Activity size={16} />
              <p className="text-xs uppercase tracking-widest font-bold">
                {t("dashboard.activeCampaigns")}
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-200 dark:border-indigo-500/20">
              3 EN COURS
            </span>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Lancement Collection Été",
                progress: 80,
                status: "Optimisation",
              },
              {
                name: "Promotion Flash Week-end",
                progress: 40,
                status: "Génération",
              },
            ].map((camp, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-s dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-all"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text dark:text-white">
                    {camp.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{camp.status}</p>
                </div>
                <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${camp.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {camp.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 p-8 bg-emerald-400 dark:bg-gradient-to-br dark:from-indigo-600/20 dark:to-emerald-600/20 border border-emerald-100 dark:border-slate-800 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-emerald-500 shadow-sm dark:shadow-none backdrop-blur-md">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t("dashboard.quickAction")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-light">
              L'IA est prête à analyser vos nouveaux objectifs.
            </p>
          </div>
          <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-xl shadow-emerald-500/10 flex items-center gap-2">
            <Zap size={18} fill="currentColor" />{" "}
            {t("dashboard.quickActionBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
