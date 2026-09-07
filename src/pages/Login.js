import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Erreur de connexion : " + error.message);
    } else {
      onLoginSuccess();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Erreur de connexion avec Google : " + error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-emerald-500 mb-2">YEFAITOU</h1>
          <p className="text-slate-500">Connectez-vous pour optimiser votre marketing</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all disabled:bg-slate-100 mb-5"
        >
          <span className="text-lg font-black">G</span>
          {googleLoading ? "Connexion avec Google..." : "Continuer avec Google"}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400 font-medium">OU</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:bg-slate-400"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Pas encore de compte ?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/signup"; }} className="text-indigo-600 font-bold">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
