import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import CampaignStudio from "./pages/CampaignStudio";
import SocialSettings from "./pages/SocialSettings";
import LandingPage from "./pages/LandingPage";
import { CreditProvider } from "./context/CreditContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import {
  LayoutDashboard, Rocket, Wallet as WalletIcon, Link, LogOut,
  Command, Menu, X, Sun, Moon,
} from "lucide-react";

const Sidebar = ({ theme, setTheme, isCollapsed, setIsCollapsed, currentPage, setCurrentPage, handleLogout, isMobileMenuOpen, setIsMobileMenuOpen, onLogoClick }) => {
  const { lang, setLang, t } = useLanguage();
  return (
    <nav className={`fixed md:relative z-40 h-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isCollapsed ? "w-20" : "w-64"} ${theme === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"} border-r flex flex-col backdrop-blur-xl`}>
      <div className="p-6 flex items-center justify-between">
        <div onClick={onLogoClick} className="flex items-center gap-3 overflow-hidden cursor-pointer group transition-transform active:scale-95">
          <div className="w-8 h-8 min-w-[32px] bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg group-hover:rotate-12 transition-transform">Y</div>
          {!isCollapsed && <h1 className={`text-xl font-bold tracking-tighter ${theme === "dark" ? "text-white" : "text-slate-900"}`}>YEFAITOU</h1>}
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`hidden md:flex p-1.5 rounded-lg transition-colors ${theme === "dark" ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-500 hover:text-slate-900"}`}>{isCollapsed ? <Menu size={16} /> : <X size={16} />}</button>
      </div>
      <div className="flex-1 px-4 space-y-2 mt-6">
        {[{ id: "dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard }, { id: "studio", labelKey: "nav.studio", icon: Rocket }, { id: "wallet", labelKey: "nav.wallet", icon: WalletIcon }, { id: "settings", labelKey: "nav.settings", icon: Link }].map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => { setCurrentPage(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentPage === item.id ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20" : theme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}><Icon size={20} />{!isCollapsed && <span>{t(item.labelKey)}</span>}</button>;
        })}
      </div>
      <div className="p-6 border-t border-slate-800 space-y-4">
        <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all text-xs font-bold ${theme === "dark" ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{lang === "fr" ? "🇺🇸 English" : "🇫🇷 Français"}</button>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${theme === "dark" ? "bg-slate-800/50 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}{!isCollapsed && <span>{theme === "dark" ? "Mode Clair" : "Mode Sombre"}</span>}</button>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${theme === "dark" ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"}`}><LogOut size={20} />{!isCollapsed && <span>{t("nav.logout")}</span>}</button>
        {!isCollapsed && <div className={`p-4 rounded-2xl text-xs border transition-colors ${theme === "dark" ? "bg-slate-950 text-slate-500 border-slate-800" : "bg-slate-100 text-slate-400 border-slate-200"}`}><div className="flex items-center gap-2 mb-1"><Command size={12} className="text-emerald-500" /><p className="font-bold text-slate-300">v1.0 Stable</p></div><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><p>Cloud actif</p></div></div>}
      </div>
    </nav>
  );
};

const App = () => {
  const path = window.location.pathname;
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [authPage, setAuthPage] = useState(path === "/signup" ? "signup" : "login");
  const [showLanding, setShowLanding] = useState(!["/login", "/signup"].includes(path));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      if (session) setShowLanding(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession) setShowLanding(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setShowLanding(true);
  };

  if (showLanding && !session) return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  if (!session) return authPage === "login" ? <Login onLoginSuccess={(nextSession) => setSession(nextSession || true)} /> : <Signup onSignupSuccess={() => setAuthPage("login")} />;

  return (
    <LanguageProvider>
      <CreditProvider>
        <div className={`flex min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#020617] text-slate-300" : "bg-slate-50 text-slate-900"}`}>
          <div className={`md:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 border-b transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div onClick={() => setShowLanding(true)} className="flex items-center gap-2 cursor-pointer"><div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950 font-black">Y</div><h1 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>YEFAITOU</h1></div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400"><Menu size={24} /></button>
          </div>
          <Sidebar theme={theme} setTheme={setTheme} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} currentPage={currentPage} setCurrentPage={setCurrentPage} handleLogout={handleLogout} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onLogoClick={() => setShowLanding(true)} />
          {isMobileMenuOpen && <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isMobileMenuOpen ? "pl-0" : "pt-16 md:pt-0"} ${theme === "dark" ? "bg-[#020617]" : "bg-slate-50"}`}>
            {currentPage === "dashboard" && <Dashboard />}
            {currentPage === "studio" && <CampaignStudio />}
            {currentPage === "wallet" && <Wallet />}
            {currentPage === "settings" && <SocialSettings />}
          </main>
        </div>
      </CreditProvider>
    </LanguageProvider>
  );
};

export default App;
