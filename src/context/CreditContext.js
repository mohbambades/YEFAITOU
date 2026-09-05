import React, { createContext, useState, useContext } from "react";

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "purchase",
      amount: 1000,
      balanceAfter: 1000,
      date: "2026-09-01",
      description: "Premier dépôt",
    },
    {
      id: 2,
      type: "usage",
      amount: -5,
      balanceAfter: 995,
      date: "2026-09-01",
      description: "Génération de post",
    },
  ]);

  const addCredits = (amount) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "purchase",
        amount,
        balanceAfter: balance + amount,
        date: new Date().toISOString().split("T")[0],
        description: "Achat de crédits",
      },
      ...prev,
    ]);
  };

  const spendCredits = (amount, description) => {
    if (balance < amount) throw new Error("Solde insuffisant");
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "usage",
        amount: -amount,
        balanceAfter: balance - amount,
        date: new Date().toISOString().split("T")[0],
        description,
      },
      ...prev,
    ]);
  };

  return (
    <CreditContext.Provider
      value={{ balance, transactions, addCredits, spendCredits }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
