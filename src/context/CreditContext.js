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
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadCredits();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Toutes les consommations passent par la fonction PostgreSQL SECURITY DEFINER.
  // Le navigateur ne peut donc pas modifier directement le solde.
  const spendCredits = async (amount, description, referenceId = null) => {
    const parsedAmount = Number(amount);

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Montant de crédits invalide.");
    }

    const { data, error } = await supabase.rpc("spend_credits", {
      p_amount: parsedAmount,
      p_description: description,
      p_reference_id: referenceId,
    });

    if (error) {
      if (error.message?.includes("INSUFFICIENT_CREDITS")) {
        throw new Error("INSUFFICIENT_CREDITS");
      }
      throw error;
    }

    const newBalance = Number(data?.balance ?? 0);
    setBalance(newBalance);
    await loadCredits();
    return newBalance;
  };

  // Deliberately unavailable to the browser. Credits are granted only by trusted
  // payment/webhook infrastructure through the service-role path.
  const addCredits = async () => {
    throw new Error("Les crédits sont ajoutés uniquement après confirmation serveur du paiement.");
  };

  return (
    <CreditContext.Provider
      value={{
        balance,
        transactions,
        loading,
        refreshCredits: loadCredits,
        addCredits,
        spendCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
