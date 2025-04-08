"use client";

import React, { useEffect, useState } from "react";
import { renderMyTransactions } from "../../service/apiTracker";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Mycard from "./Mycard";
import { useAuth } from "@/context/AuthContext";
import moment from "moment";
import Composedchart from "./Composedchart";
import Mbarchart from "./Mbarchart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Loading from "../app/loading";
import { ToastContainer, toast } from "react-toastify";

interface Transaction {
  amount: number;
  categary: string;
  created_at: string;
  id: string;
  note: string;
  type: "income" | "expense";
  user_id: string;
  formattedDate?: string;
}

interface Summary {
  income: number;
  expenses: number;
  balance: number;
}

const Showsummary = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const { user } = useAuth();

  // Fetch transactions from API
  useEffect(() => {
    if (!user) return;

    async function fetchTransactionData() {
      try {
        const res = await renderMyTransactions();

        if (!res || res.length === 0) {
          console.warn("No transactions found.");
          return;
        }

        const formattedTransactions = res
          .filter((elm) => elm.user_id === user?.id)
          .map((txn: Transaction) => ({
            ...txn,
            formattedDate: moment(txn.created_at).format("MMMM YYYY"),
          }));

        setTransactions(formattedTransactions);

        const uniqueMonths = [
          ...new Set(formattedTransactions.map((txn) => txn.formattedDate)),
        ];
        setMonths(uniqueMonths);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    }

    fetchTransactionData();
  }, [user]);

  // Update summary when month index changes
  useEffect(() => {
    if (months.length > 0) {
      const selectedMonth = months[currentIndex];

      const filteredTransactions = transactions.filter(
        (txn) => txn.formattedDate === selectedMonth
      );

      const income = filteredTransactions
        .filter((txn) => txn.type === "income")
        .reduce((sum, txn) => sum + txn.amount, 0);

      const expenses = filteredTransactions
        .filter((txn) => txn.type === "expense")
        .reduce((sum, txn) => sum + txn.amount, 0);

      const balance = income - expenses < 0 ? 0 : income - expenses;

      setSummary({ income, expenses, balance });
    }
  }, [currentIndex, months, transactions]);

  const handleLeftClick = () => setCurrentIndex((prev) => prev - 1);
  const handleRightClick = () => setCurrentIndex((prev) => prev + 1);

  const expensebarchartdata = transactions.filter(
    (txn) => txn.type === "expense"
  );
  const incomebarchartdata = transactions.filter(
    (txn) => txn.type === "income"
  );

  if (transactions.length === 0) return <Loading />;

  return (
    <div className="summerysec">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="darken"
      />
      <div className="topbox">
        <button
          onClick={() => {
            if (currentIndex === 0) {
              toast.warn("You are already on the first month!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            } else {
              handleLeftClick();
            }
          }}
        >
          <ChevronLeftIcon />
        </button>
        <span>{months[currentIndex]}</span>
        <button
          onClick={() => {
            if (currentIndex === months.length - 1) {
              toast.warn("You are already on the first month!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            } else {
              handleRightClick();
            }
          }}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Mycard type="Monthly Income" amount={summary.income} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Mycard type="Monthly Expenses" amount={summary.expenses} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Mycard type="Monthly Balance" amount={summary.balance} />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <div className="graph gridbxtwo">
              <div className="chatbx">
                <Composedchart mydata={expensebarchartdata} />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="graph gridbxtwo">
              <div className="chatbx">
                <Mbarchart mydata={incomebarchartdata} />
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Showsummary;
