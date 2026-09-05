import React, { useState } from "react";
import { SOCIAL_ICONS_MAP } from "../lib/socialIcons"; // Importez la map

const SOCIAL_PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook Page",
    icon: SOCIAL_ICONS_MAP.facebook, // Utilisez la map ici
    desc: "Publiez automatiquement sur votre page et vos groupes.",
  },
  {
    id: "instagram",
    name: "Instagram Business",
    icon: SOCIAL_ICONS_MAP.instagram, // Utilisez la map ici
    desc: "Générez des Reels et des posts automatisés.",
  },
];

const SocialSettings = () => {
  const [connections, setConnections] = useState({
    facebook: false,
    instagram: false,
  });
  const [isConnecting, setIsConnecting] = useState(null);

  const handleConnect = (platformId) => {
    setIsConnecting(platformId);
    setTimeout(() => {
      setConnections((prev) => ({ ...prev, [platformId]: true }));
      setIsConnecting(null);
    }, 2000);
  };

  return (
    <div className="p-8 bg-slate- dark:bg-[#020617] min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate- dark:text-white">
            Connexions Sociales
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Liez vos comptes pour activer le Robot.
          </p>
        </header>

        <div className="grid gap-6">
          {SOCIAL_PLATFORMS.map((platform) => {
            const IconComponent = platform.icon; // On assigne à une variable commençant par une MAJUSCULE
            return (
              <div
                key={platform.id}
                className="bg- dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all hover:border-emerald-500"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                    <IconComponent /> {/* On utilise le composant ici */}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-9 dark:text-white">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {platform.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(platform.id)}
                  disabled={isConnecting === platform.id}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    connections[platform.id]
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950"
                  }`}
                >
                  {connections[platform.id]
                    ? "Connecté ✅"
                    : isConnecting === platform.id
                    ? "..."
                    : "Connecter"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SocialSettings;
