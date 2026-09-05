const SUPABASE_URL = "https://wovzjfmqjgnfudnvmxgt.supabase.co/functions/v1";

export const aiService = {
  async generateStrategy(goal, target) {
    const response = await fetch(`${SUPABASE_URL}/generate-ai-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateStrategy", goal, target }),
    });
    if (!response.ok) throw new Error("Erreur serveur IA");
    return await response.json();
  },

  async generateAssets(strategy) {
    const response = await fetch(`${SUPABASE_URL}/generate-ai-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateAssets", strategy }),
    });
    if (!response.ok) throw new Error("Erreur génération visuels");
    return await response.json();
  },
};
