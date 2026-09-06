import React, { useState } from "react";
import { aiService } from "../lib/aiService";
import { useLanguage } from "../context/LanguageContext";
import StrategyView from "../components/StrategyView";
import { useCredits } from "../context/CreditContext";
import { Target, Cpu, Send, RotateCcw, CheckCircle } from "lucide-react";

const PUBLISH_FUNCTION_URL = "https://wovzjfmqjgnfudnvmxgt.supabase.co/functions/v1/publish-to-social";

const CampaignStudio = () => {
  const { spendCredits, balance } = useCredits();
  const { t } = useLanguage();
  const [goal, setGoal] = useState("");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [assets, setAssets] = useState(null);
  const [executionStep, setExecutionStep] = useState("setup");

  const handleGenerateStrategy = async () => {
    if (!goal.trim()) return alert("Veuillez définir un objectif");
    setLoading(true);
    try {
      const result = await aiService.generateStrategy(goal.trim(), target.trim());
      setStrategy(result);
      setExecutionStep("strategy");
    } catch (error) {
      alert(error.message || "Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRobot = async () => {
    if (balance < 50) return alert("Solde insuffisant : 50 crédits sont nécessaires.");
    try {
      // Le contexte de crédits refuse désormais les mutations client-side.
      // Cette action restera donc bloquée tant que le RPC Edge Function sécurisé n'est pas branché.
      await spendCredits(50, "Lancement Robot");
      setExecutionStep("generation");
      const generatedAssets = await aiService.generateAssets(strategy);
      setAssets(generatedAssets);
      setExecutionStep("review");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleFinalPublish = async () => {
    try {
      for (const [platform, data] of Object.entries(assets || {})) {
        const response = await fetch(PUBLISH_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: data.image, caption: data.caption, platform }),
        });
        if (!response.ok) {
          let errorMessage = `Erreur lors de la publication sur ${platform}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (_) {}
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
    <div className="min-h-full p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 md:mb-12">
        <div className="breadcrumbs text-sm mb-3"><ul><li>YEFAITOU</li><li>Studio</li></ul></div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t("studio.title")}</h1>
            <p className="text-base-content/60 mt-2">{t("studio.sub")}</p>
          </div>
          <div className="badge badge-success badge-outline gap-2 py-3 px-4">{balance.toLocaleString("fr-FR")} crédits</div>
        </div>
      </header>

      <ul className="steps steps-horizontal w-full mb-8 text-xs md:text-sm">
        <li className={`step ${executionStep !== "setup" ? "step-success" : "step-primary"}`}>Objectif</li>
        <li className={`step ${["generation", "review"].includes(executionStep) ? "step-success" : ""}`}>Stratégie</li>
        <li className={`step ${executionStep === "review" ? "step-success" : ""}`}>Création</li>
        <li className="step">Publication</li>
      </ul>

      {executionStep === "setup" && (
        <div className="card bg-base-100 border border-base-300 shadow-xl max-w-3xl">
          <div className="card-body p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="btn btn-square btn-success btn-sm"><Target size={17} /></div>
              <div><h2 className="card-title">Définissez votre objectif</h2><p className="text-sm text-base-content/60">L'IA construira la stratégie autour de ce résultat.</p></div>
            </div>
            <div className="form-control mb-5">
              <label className="label"><span className="label-text font-bold">{t("studio.goalLabel")}</span></label>
              <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Ex : Vendre 100 sacs luxe" className="input input-bordered input-lg w-full focus:input-success" />
            </div>
            <div className="form-control mb-7">
              <label className="label"><span className="label-text font-bold">{t("studio.targetLabel")}</span></label>
              <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Ex : Femmes 20-30 ans, Abidjan" className="input input-bordered input-lg w-full focus:input-success" />
            </div>
            <button onClick={handleGenerateStrategy} disabled={loading} className="btn btn-success btn-lg w-full">
              {loading ? <><span className="loading loading-spinner" /> Analyse IA en cours...</> : t("studio.generateBtn")}
            </button>
          </div>
        </div>
      )}

      {executionStep === "strategy" && strategy && (
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 shadow-xl"><div className="card-body p-2 md:p-4"><StrategyView strategy={strategy} /></div></div>
          <div className="join w-full flex flex-col md:flex-row gap-3">
            <button onClick={() => setExecutionStep("setup")} className="btn btn-outline join-item flex-1"><RotateCcw size={18} /> Modifier</button>
            <button onClick={handleLaunchRobot} className="btn btn-primary join-item flex-1"><Cpu size={18} /> {t("studio.robotBtn")}</button>
          </div>
        </div>
      )}

      {executionStep === "generation" && (
        <div className="card bg-base-100 border border-base-300 shadow-xl"><div className="card-body items-center text-center py-20">
          <span className="loading loading-ring loading-lg text-success scale-150 mb-6" />
          <h2 className="text-3xl font-black">Génération des actifs...</h2>
          <p className="text-base-content/60 max-w-md mt-2">L'IA crée vos visuels et rédige vos légendes en temps réel.</p>
          <progress className="progress progress-success w-64 mt-6" />
        </div></div>
      )}

      {executionStep === "review" && assets && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div><h2 className="text-3xl font-black">{t("studio.reviewTitle")}</h2><p className="text-base-content/60 mt-1">Vérifiez vos contenus avant publication.</p></div>
            <div className="badge badge-success gap-2 py-3 px-4"><CheckCircle size={13} /> PRÊT À PUBLIER</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(assets).map(([platform, data]) => (
              <div key={platform} className="card bg-base-100 border border-base-300 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <figure className="relative"><img src={data.image} alt={platform} className="w-full h-72 object-cover" /><div className="badge badge-neutral absolute top-4 left-4 uppercase">{platform}</div></figure>
                <div className="card-body"><p className="text-sm leading-relaxed italic">&quot;{data.caption}&quot;</p><button className="btn btn-ghost btn-sm mt-2">Modifier le texte</button></div>
              </div>
            ))}
          </div>
          <button onClick={handleFinalPublish} className="btn btn-success btn-lg w-full"><Send size={20} /> {t("studio.publishBtn")}</button>
        </div>
      )}
    </div>
  );
};

export default CampaignStudio;
