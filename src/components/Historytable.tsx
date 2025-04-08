"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Box,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import Chip from "@mui/material/Chip";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import {
  renderMyTransactions,
  deleteTransations,
} from "../../service/apiTracker";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Link from "next/link";
import { CiExport } from "react-icons/ci";
import { gettingUser } from "../../service/apiUser";
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
}

const Historytable = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<mytransationtype[]>([]);
  const [coppytransactions, setCoppytransactions] = useState<
    mytransationtype[]
  >([]);
  const [, setSelectedDate] = useState("");
  const [, setOpen] = useState(false);

  myAuth();
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchTransactionData();
  }, []);

  async function fetchTransactionData() {
    try {
      const mydata = await gettingUser();
      if (mydata?.id) {
        const allTransactions = await renderMyTransactions();
        if (!allTransactions) {
          console.warn("No transactions found!");
          setTransactions([]);
          return;
        }

        const filteredTransactions = allTransactions.filter(
          (elm) => elm.user_id === null || elm.user_id === mydata.id
        );

        setTransactions(filteredTransactions);
        setCoppytransactions(filteredTransactions);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  function changeoption(e: SelectChangeEvent<string>) {
    const newValue = e.target.value;

    if (newValue === "all") {
      setCoppytransactions(transactions);
    } else {
      const filtertranstype = transactions.filter(
        (elm) => elm.type === newValue
      );
      setCoppytransactions(filtertranstype);
    }
  }

  function changcatagory(e: SelectChangeEvent<string>) {
    const newValue = e.target.value;

    if (newValue === "all") {
      setCoppytransactions(transactions);
    } else {
      const filteredTransactions = transactions.filter(
        (elm) => elm.categary === newValue
      );
      setCoppytransactions(filteredTransactions);
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const keyword = e.target.value.toLowerCase();

    if (keyword === "all" || keyword.trim() === "") {
      setCoppytransactions(transactions);
    } else {
      const filtered = transactions.filter(
        (txn) =>
          txn.note.toLowerCase().includes(keyword) ||
          txn.categary.toLowerCase().includes(keyword) ||
          txn.type.toLowerCase().includes(keyword) ||
          txn.amount.toString().toLowerCase().includes(keyword) // <-- added this line
      );
      setCoppytransactions(filtered);
    }
  }

  function handleDelete(id: string, user_id: string) {
    deleteTransations(id, user_id);
    const deteted = coppytransactions.filter((elm) => elm.id !== id);
    setCoppytransactions(deteted);

    toast.success("Transaction Deleted Successfully !", {
      position: "top-right",
      theme: "dark",
    });
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const selected = e.target.value;
    setSelectedDate(selected);
  
    if (!selected) {
      setCoppytransactions(transactions);
      return;
    }
  
    const filteredByDate = transactions.filter((txn) =>
      txn.created_at.startsWith(selected) // assumes `created_at` is in ISO format
    );
    setCoppytransactions(filteredByDate);
  }

  function handleEdit() {
    setOpen(true);
  }

  const uniquecatagory = Array.from(
    new Set(transactions.map((elm) => elm.categary))
  );

  if (transactions.length === 0) return <Loading />;

  return (
    <div className="histrybx">
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

      <div className="wrapperbx">
        <FormControl fullWidth>
          <InputLabel id="type-label">Choose Your Transaction Type</InputLabel>
          <Select
            labelId="type-label"
            id="type-select"
            label="Choose Your Transaction Type"
            onChange={changeoption}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expenses</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="category-label">Choose Your Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            label="Choose Your Category"
            onChange={changcatagory}
          >
            <MenuItem value={"all"}>All</MenuItem>
            {uniquecatagory.map((row, i) => (
              <MenuItem value={row} key={i + "index"}>
                {row}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          fullWidth
          onChange={(e) => handleDateChange(e)}
        />

        <TextField
          // sx={{ width: "500px", height: "100%" }}
          fullWidth
          onChange={handleSearchChange}
          id="filled-basic"
          label="Search by note, type, category or amount"
          variant="filled"
        />

        

        <CSVLink
          data={transactions}
          filename="transactions.csv"
          className="exportbtn"
        >
          <CiExport
            style={{
              color: theme.palette.mode === "dark" ? "white" : "gray",
            }}
          />
        </CSVLink>
      </div>

      <TableContainer component={Paper} sx={{ overflowX: "auto", mt: "20px" }}>
        {!isMobile ? (
          <Table aria-label="desktop responsive table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#fff",
                }}
              >
                <TableCell>Type</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coppytransactions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip
                      variant="outlined"
                      color={row.type === "income" ? "success" : "primary"}
                      icon={
                        row.type === "income" ? (
                          <AttachMoneyIcon />
                        ) : (
                          <ThumbDownAltIcon />
                        )
                      }
                      label={row.type}
                    />
                  </TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell>
                    <Chip label={row.categary} variant="outlined" clickable />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`history/${row.user_id}/${row.id}`}
                      style={{
                        color: theme.palette.mode === "dark" ? "white" : "gray",
                      }}
                    >
                      <ModeEditOutlineIcon onClick={handleEdit} />
                    </Link>
                    <DeleteIcon
                      onClick={() => handleDelete(row.id, row.user_id)}
                      sx={{
                        color: theme.palette.mode === "dark" ? "white" : "gray",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 2 }} className="mobileboxhistory">
            {coppytransactions.map((elm) => (
              <Paper
                key={elm.id}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#fff",
                }}
              >
                <strong>Type:</strong> &nbsp;{elm.type}
                <br />
                <strong>Note:</strong> &nbsp;{elm.note}
                <br />
                <strong>Amount:</strong>&nbsp;₹{elm.amount}
                <br />
                <strong>Date:</strong>&nbsp;{elm.created_at}
                <br />
                <strong>Category:</strong>&nbsp;{elm.categary}
                <TableCell>
                  <Link href={`history/${elm.user_id}/${elm.id}`}>
                    <ModeEditOutlineIcon onClick={handleEdit} />
                  </Link>
                  <DeleteIcon
                    onClick={() => handleDelete(elm.id, elm.user_id)}
                  />
                </TableCell>
              </Paper>
            ))}
          </Box>
        )}
      </TableContainer>
    </div>
  );
};

export default Historytable;
