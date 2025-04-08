"use client";

import React, { useEffect, useState } from "react";
import { renderMyTransactions } from "../../service/apiTracker";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Mycard from "./Mycard";
import Mytable from "./Mytable";
import { gettingUser } from "../../service/apiUser";
import { useTheme } from "@mui/material/styles";
import Mybarchart from "./Mybarchart";
import { Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import moment from "moment";
import Achart from "./Achart";
import { myAuth } from "../../hooks/myAuth";
import Loading from "../app/loading";

interface mytransationtype {
  amount: number;
  categary: string;
  created_at: string;
  id: string;
  note: string;
  type: string;
  user_id: string;
  newdata: string;
}

const Overview = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { loading } = myAuth();

  const [transactions, setTransactions] = useState<mytransationtype[]>([]);

  const expenses = transactions
    .filter((elm) => elm.type === "expense")
    .reduce((acc, cur) => {
      acc = acc + cur.amount;
      return acc;
    }, 0);

  const income = transactions
    .filter((elm) => elm.type === "income")
    .reduce((acc, cur) => {
      acc = acc + cur.amount;
      return acc;
    }, 0);

  const balance = income - expenses;

  //Fetch Transactions Userwise
  async function fetchTransactionData() {
    try {
      const mydata = await gettingUser();
      if (mydata?.id) {
        const allTransactions = await renderMyTransactions();

        if (!allTransactions) {
          console.warn("No transactions found!");
          setTransactions([]); // Set an empty array to avoid further errors
          return;
        }

        const filteredTransactions = allTransactions.filter(
          (elm) => elm.user_id === null || elm.user_id === mydata.id
        );

        setTransactions(filteredTransactions);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  useEffect(() => {
    fetchTransactionData();
  }, []);

  //Findout recent month transactions and add modified dateinto the column
  const latestMonth = moment
    .max(transactions.map((t) => moment(t.created_at)))
    .format("YYYY-MM");
  const recentTransactions = transactions
    .filter((t) => moment(t.created_at).format("YYYY-MM") === latestMonth)
    .map((t) => ({
      ...t,
      modified_date: moment(t.created_at).format("MMMM YYYY"), // Example: "April 2025 11:00:34"
    }));

  //Findout icome and expense filtered data
  const incomedata = transactions.filter((elm) => elm.type === "income");

  const expensedata = transactions.filter((elm) => elm.type === "expense");

  if (loading) return <p>Checking login...</p>;

  return (
    <div className="overviewbx">
      <Typography variant="h2" gutterBottom>
        Hi,{" "}
        {user?.identities && user.identities.length > 0
          ? user?.identities[0]?.identity_data?.full_name ||
            user?.identities[0]?.identity_data?.email
          : "User"}{" "}
        👋
      </Typography>
      {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> */}

      <div
        className="myoverviewbx"
        style={{
          border:
            theme.palette.mode === "dark"
              ? "2px solid #333"
              : "2px solid #a8a4a44a",
        }}
      >
        <h5>✨ Marvilo – Smart Expense Tracker</h5>
        <p>
          Marvilo helps you track income & expenses, set monthly budgets, create
          custom categories, export data, and view monthly summaries—all in one
          place. Stay in control of your finances effortlessly! 🚀
        </p>
      </div>

      {transactions.length == 0 ? (
        <Loading />
      ) : (
        <>
          <Box sx={{ flexGrow: 1 }} className="gridbx">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Mycard type="Income" amount={income} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Mycard type="Expenses" amount={expenses} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Mycard type="Balance" amount={balance} />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ flexGrow: 1 }} className="gridbxtwo">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <div className="chatbx">
                  <Achart mydata={incomedata} />
                </div>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
              <div className="chatbx">
                <Mybarchart mydata={expensedata} />
                </div>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <Mytable tdata={recentTransactions} />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default Overview;
