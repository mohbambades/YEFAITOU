import React, { useState } from "react";
import { aiService } from "../lib/aiService";
import { useLanguage } from "../context/LanguageContext";
import StrategyView from "../components/StrategyView";
import { useCredits } from "../context/CreditContext";
import { Target, Cpu, Send, RotateCcw, CheckCircle } from "lucide-react";

const PUBLISH_FUNCTION_URL =
  "https://wovzjfmqjgnfudnvmxgt.supabase.co/functions/v1/publish-to-social";

const CampaignStudio = () => {
  const { spendCredits } = useCredits();
  const { t } = useLanguage();
  const [goal, setGoal] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [assets, setAssets] = useState(null);
  const [executionStep, setExecutionStep] = useState("setup");

  const handleGenerateStrategy = async () => {
    if (!goal) return alert("Veuillez définir un objectif");
    setLoading(true);
    try {
      const result = await aiService.generateStrategy(goal, target);
      setStrategy(result);
      setExecutionStep("strategy");
    } catch (error) {
      alert("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRobot = async () => {
    try {
      spendCredits(50, "Lancement Robot");
      setExecutionStep("generation");
      const generatedAssets = await aiService.generateAssets(strategy);
      setAssets(generatedAssets);
      setExecutionStep("review");
    } catch (e) {
      alert(e.message);
    }
  };

  // Les identifiants et tokens sociaux ne doivent jamais être exposés dans le navigateur.
  // La Supabase Edge Function récupère la connexion sociale sécurisée côté serveur.
  const handleFinalPublish = async () => {
    try {
      for (const [platform, data] of Object.entries(assets || {})) {
        const response = await fetch(PUBLISH_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: data.image,
            caption: data.caption,
            platform,
          }),
        });

        if (!response.ok) {
          let errorMessage = `Erreur lors de la publication sur ${platform}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (_) {
            // Keep the generic error when the function does not return JSON.
          }
          throw new Error(errorMessage);
        }
      }

      alert("🚀 Félicitations ! Votre campagne a été publiée avec succès !");
      setExecutionStep("setup");
      setStrategy(null);
      setAssets(null);
    } catch (error) {
      console.error("Erreur publication:", error);
      alert(`Erreur de publication : ${error.message}`);
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {t("studio.title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {t("studio.sub")}
        </p>
      </header>

      {executionStep === "setup" && (
        <div className="max-w-2xl bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-xl dark:shadow-none space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-emerald-500 transition-colors">
                <Target size={14} /> {t("studio.goalLabel")}
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: Vendre 100 sacs luxe"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-emerald-500 transition-colors">
                <Target size={14} /> {t("studio.targetLabel")}
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Ex: Femmes 20-30 ans, Abidjan"
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateStrategy}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all ${
              loading
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500"
                : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {loading ? "Analyse IA en cours..." : t("studio.generateBtn")}
          </button>
        </div>
      )}

      {executionStep === "strategy" && strategy && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-1 shadow-xl dark:shadow-none">
            <StrategyView strategy={strategy} />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setExecutionStep("setup")}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Modifier
            </button>
            <button
              onClick={handleLaunchRobot}
              className="flex-1 py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Cpu size={18} /> {t("studio.robotBtn")}
            </button>
          </div>
        </div>
      )}

      {executionStep === "generation" && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full animate-ping absolute inset-0"></div>
            <div className="relative w-24 h-24 bg-white dark:bg-slate-900 border border-emerald-500 rounded-full flex items-center justify-center">
              <Cpu size={40} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Génération des Actifs...
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            L'IA crée vos visuels et rédige vos légendes en temps réel.
          </p>
          <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-pulse w-1/2"></div>
          </div>
        </div>
      )}

      {executionStep === "review" && assets && (
        <div className="space-y-12">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {t("studio.reviewTitle")}
            </h2>
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle size={12} /> PRÊT À PUBLIER
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(assets).map(([platform, data]) => (
              <div
                key={platform}
                className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden group transition-all hover:border-emerald-500"
              >
                <div className="relative">
                  <img
                    src={data.image}
                    alt={platform}
                    className="w-full h-72 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-full text-[10px] font-bold text-white uppercase">
                    {platform}
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                    &quot;{data.caption}&quot;
                  </p>
                  <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm">
                    Modifier le texte
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleFinalPublish}
            className="w-full py-6 bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2.5rem] shadow-2xl hover:bg-emerald-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <Send size={24} /> {t("studio.publishBtn")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignStudio;
