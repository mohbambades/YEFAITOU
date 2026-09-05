import React from "react";

const LandingPage = ({ onGetStarted }) => {
  return (
    // On utilise an l'état global du thème si disponible, sinon on définit un look adaptable
    <div className="bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-300 min-h-screen font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 bg-white/70 dark:bg-[#020617]/70">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg transition-transform group-hover:rotate-12">
              Y
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
              YEFAITOU
            </h1>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a
              href="#features"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Produit
            </a>
            <a
              href="#pricing"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Tarifs
            </a>
          </div>
          <button
            onClick={onGetStarted}
            className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-full text-sm hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
          >
            Démarrer
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            V1.0 est disponible
          </div>
          <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1]">
            L'IA qui{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">
              automatise
            </span>{" "}
            <br />
            votre croissance.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            YEFAITOU analyse vos cibles, conçoit vos stratégies et publie vos
            contenus automatiquement.
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {" "}
              Le marketing, sans le stress.
            </span>
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-emerald-500 text-slate-950 font-black text-lg rounded-2xl transition-all hover:bg-emerald-400 transform hover:scale-105 shadow-2xl shadow-emerald-500/30"
            >
              Lancer mon Robot 🚀
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-lg rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Découvrir le flux
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-emerald-500 transition-all group backdrop-blur-sm">
            <div className="flex justify-between items-start mb-12">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold">
                Cerveau IA
              </div>
              <div className="text-slate-400 dark:text-slate-600 text-xs uppercase tracking-widest">
                Stratégie
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Analyse et Stratégie prédictive
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-8">
              L'IA analyse vos cibles pour créer un angle d'attaque
              mathématiquement optimisé.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-100 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800/50">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Taux de conversion
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    12.4%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-300">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>{" "}
                  Analyse terminée
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-emerald-500 transition-all backdrop-blur-sm">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold mb-6 w-max">
              Visuels
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Design IA
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Génération automatique d'images haute résolution adaptées à chaque
              plateforme.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Choisissez votre forfait
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Des crédits IA adaptés à votre ambition. Sans abonnement, sans surprise.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-emerald-500 transition-all group backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6 shadow-lg"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">5 000</div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">crédits · 5 000 FCFA</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 campagne IA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Visuels automatiques
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 compte social
              </li>
            </ul>
            <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all">
              Choisir Starter
            </button>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900/40 border-2 border-emerald-500 rounded-[2rem] relative backdrop-blur-sm shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-full">
              POPULAIRE
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 mb-6 shadow-lg"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Growth</h3>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">20 000</div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">crédits · 15 000 FCFA</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 4 campagnes IA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Visuels premium
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 3 comptes sociaux
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Stratégie prédictive
              </li>
            </ul>
            <button className="w-full py-3 bg-emerald-500 text-slate-950 rounded-2xl font-bold hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20">
              Choisir Growth
            </button>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-indigo-500 transition-all group backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-500 mb-6 shadow-lg"></div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Scale</h3>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">60 000</div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">crédits · 40 000 FCFA</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Campagnes illimitées
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Visuels + vidéos IA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Comptes sociaux illimités
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Support prioritaire
              </li>
            </ul>
            <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-indigo-500 hover:text-white transition-all">
              Choisir Scale
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/50 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg">Y</div>
            <span className="font-bold text-slate-900 dark:text-white">YEFAITOU</span>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            © 2026 YEFAITOU. L'IA au service de votre croissance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
