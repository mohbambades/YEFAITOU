import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const CreditContext = createContext(null);

export const CreditProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCredits = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBalance(0);
        setTransactions([]);
        return;
      }

      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (walletError) throw walletError;
      setBalance(Number(wallet?.balance || 0));

      const { data: txs, error: txError } = await supabase
        .from("credit_transactions")
        .select("id,type,amount,balance_after,description,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (txError) throw txError;
      setTransactions(
        (txs || []).map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: Number(tx.amount),
          balanceAfter: Number(tx.balance_after),
          date: new Date(tx.created_at).toLocaleDateString("fr-FR"),
          description: tx.description || "Transaction",
        }))
      );
    } catch (error) {
      console.error("Erreur chargement crédits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredits();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadCredits();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Les crédits ne peuvent plus être ajoutés/modifiés directement depuis le navigateur.
  // Les achats et consommations devront passer par des fonctions serveur/RPC sécurisées.
  const addCredits = async () => {
    throw new Error("Les crédits doivent être ajoutés après confirmation serveur du paiement.");
  };

  const spendCredits = async () => {
    throw new Error("La consommation de crédits doit être validée côté serveur.");
  };

  return (
    <CreditContext.Provider
      value={{ balance, transactions, loading, refreshCredits: loadCredits, addCredits, spendCredits }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
