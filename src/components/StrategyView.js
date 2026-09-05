import React from "react";

const StrategyView = ({ strategy }) => {
  if (!strategy) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v13a4 4 0 0 0 4 4h6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          Stratégie Recommandée par l'IA
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Angle d'attaque
            </p>
            <p className="text-slate-700 font-medium">{strategy.angle}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Cible Prioritaire
            </p>
            <p className="text-slate-700 font-medium">{strategy.target}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Canaux Optimaux
            </p>
            <p className="text-slate-700 font-medium">
              {strategy.channels?.join(", ") || "Non défini"}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Budget Estimé
            </p>
            <p className="text-slate-700 font-medium">
              {strategy.budget} crédits
            </p>
          </div>
        </div>
      </div>

      {strategy.recommendations && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm font-bold text-slate-800 mb-3">
            Conseils d'optimisation :
          </p>
          <ul className="space-y-2">
            {strategy.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-3 text-sm text-slate-600">
                <span className="text-emerald-500">✔</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StrategyView;
