"use client";

import React, { useEffect, useState } from "react";
import { renderMyTransactions } from "../../service/apiTracker";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Mycard from "./Mycard";
import { useAuth } from "@/context/AuthContext";
import moment from "moment";
import Composedchart from "./Composedchart";
import Mbarchart from './Mbarchart'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { myAuth } from "../../hooks/myAuth";
import Loading from '../app/loading'


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
    if (!user) return; // Don't run if user is undefined

    async function fetchTransactionData() {
      try {
        const res = await renderMyTransactions();

        if (!res || res.length === 0) {
          console.warn("No transactions found.");
          return;
        }

        // Format transactions and extract unique months*******
        const formattedTransactions = res
          .filter((elm) => elm.user_id === user?.id)
          .map((txn: Transaction) => ({
            ...txn,
            formattedDate: moment(txn.created_at).format("MMMM YYYY"),
          }));

        setTransactions(formattedTransactions);

        // Extract unique months
        const uniqueMonths = [
          ...new Set(formattedTransactions.map((txn) => txn.formattedDate)),
        ];
        setMonths(uniqueMonths);

        // Set summary for first month
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    }

    fetchTransactionData();
  }, [user]);

  // Function to calculate summary for a specific month
  function updateSummary(myindex: number = 0) {
    let mytransactions = transactions.filter(
      (elm) => elm.formattedDate === months[myindex]
    );

    const income = mytransactions
      .filter((txn) => txn.type === "income")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const expenses = mytransactions
      .filter((txn) => txn.type === "expense")
      .reduce((sum, txn) => sum + txn.amount, 0);

    setSummary({ income, expenses, balance: income - expenses < 0 ? 0 : income - expenses });
  }


  let expensebarchartdata= transactions
  .filter((txn) => txn.type === "expense");

  let incomebarchartdata= transactions
  .filter((txn) => txn.type === "income");

  

  // Update summary when month index changes
  useEffect(() => {
    if (months.length > 0) {
      updateSummary(currentIndex);
    }
  }, [currentIndex, months, transactions]);

  // Handle previous month click
  function handleLeftClick() {
    setCurrentIndex((elm) => elm - 1);
  }

  // Handle next month click
  function handleRightClick() {
    setCurrentIndex((elm) => elm + 1);
  }

  const { loading } = myAuth();

  if(transactions.length==0)return <Loading />

  return (
    <div className="summerysec">
      <div className="topbox">
        <button onClick={handleLeftClick} disabled={currentIndex === 0}>
          <ChevronLeftIcon/>
        </button>
        <span> {months[currentIndex]}</span>
        <button
          onClick={handleRightClick}
          disabled={currentIndex === months.length - 1}
        >
          <ChevronRightIcon/>
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
            <div className="graph">
            <Composedchart mydata={expensebarchartdata}/>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="graph">
            <Mbarchart mydata={incomebarchartdata} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Showsummary;
