import React from "react";

const CreditCard = ({ balance, onRecharge }) => {
  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="relative z-10">
        <p className="text-slate-400 text-sm font-medium mb-1">
          Solde disponible
        </p>
        <h2 className="text-4xl font-bold mb-4">
          {balance}{" "}
          <span className="text-lg font-normal text-slate-500">crédits</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onRecharge}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + Recharger
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Historique
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
