import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Signup = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Appel à Supabase pour créer un nouvel utilisateur
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert("Erreur d'inscription : " + error.message);
    } else {
      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      if (onSignupSuccess) onSignupSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-emerald-500 mb-2">
            YEFAITOU
          </h1>
          <p className="text-slate-500">
            Créez votre compte pour propulser votre business
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
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
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:bg-slate-400"
          >
            {loading ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
          Déjà un compte ?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/login";
            }}
            className="text-indigo-600 font-bold"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
