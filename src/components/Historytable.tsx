"use client";

import React, { ReactEventHandler, useEffect, useState } from "react";
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
} from "@mui/material";

import Chip from "@mui/material/Chip";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { renderMyTransactions } from "../../service/apiTracker";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { gettingUser } from "../../service/apiUser";
import { deleteTransations } from "../../service/apiTracker";
import { ToastContainer, toast } from "react-toastify";
import { CSVLink } from "react-csv";
import Link from "next/link";
import { CiExport } from "react-icons/ci";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { myAuth } from "../../hooks/myAuth";
import Loading from '../app/loading';

interface mytransationtype {
  amount: number;
  categary: string;
  created_at: string;
  id: string;
  note: string;
  type: string;
  user_id: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Historytable = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<mytransationtype[]>([]);
  const [coppytransactions, setCoppytransactions] = useState<
    mytransationtype[]
  >([]);
  const [open, setOpen] = React.useState(false);
  
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
        setCoppytransactions(filteredTransactions);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  //Type filer
  function changeoption(e: SelectChangeEvent<string>) {
    let newValue = e.target.value;

    if (e.target.value === "all") {
      setCoppytransactions(transactions);
    } else {
      let filtertranstype = transactions.filter((elm) => elm.type === newValue);
      setCoppytransactions(filtertranstype);
    }
  }



  function changcatagory(e: SelectChangeEvent<string>) {
    const newValue = e.target.value;

    if (newValue === "all") {
      setCoppytransactions(transactions);
    } else {
      // Otherwise, filter by the selected category
      const filteredTransactions = transactions.filter(
        (elm) => elm.categary === newValue
      );
      setCoppytransactions(filteredTransactions);
    }
  }

  function inputCatagroy(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value.toLocaleLowerCase();

    if (newValue === "all") {
      setCoppytransactions(transactions);
    } else {
      // Otherwise, filter by the selected category
      const filteredTransactions = transactions.filter(
        (elm) => elm.categary === newValue
      );
      setCoppytransactions(filteredTransactions);
    }
  }

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");

  function handleDelete(id: string, user_id: string) {
    deleteTransations(id, user_id);

    let deteted = coppytransactions.filter((elm) => elm.id !== id);

    setCoppytransactions(deteted);

    toast.success("Transaction Deleted Successfully !", {
      position: "top-right",
      theme: "dark",
    });
  }

  function handleEdit() {
    handleOpen();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Find unique Categroy
  let uniquecatagory = Array.from(
    new Set(transactions.map((elm) => elm.categary))
  );

  const { loading } = myAuth();

  if(transactions.length==0)return <Loading />

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
          <InputLabel id="demo-simple-select-label">
            Chouse Your Transaction Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Chouse Your Transaction Type"
            onChange={changeoption}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expenses</MenuItem>
          </Select>
        </FormControl>

       
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Chouse Your Category
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Chouse Your Transaction Type"
            onChange={changcatagory}
          >
            <MenuItem value={"all"}>All</MenuItem>
            {uniquecatagory.map((row, i) => {
              return (
                <MenuItem value={row} key={i + "index"}>{row}</MenuItem>
              );
            })}
          </Select>
        </FormControl>

       
        <TextField sx={{width:"600px", height:"100%"}} onChange={inputCatagroy} id="filled-basic" label="Search..." variant="filled" />

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

      {/* <Modaltransaction open={open} setOpen={setOpen} /> */}

      <TableContainer component={Paper} sx={{ overflowX: "auto" , mt:"20px"}}>
        {!isMobile ? (
          // Desktop Table View
          <Table aria-label="desktop responsive table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#fff",
                }}
                hover={true}
                selected={true}
              >
                <TableCell>Type</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Categary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coppytransactions.map((row) => {
                return (
                  <TableRow key={row.id + "fdfddfsf"} hover={true}>
                    <TableCell>
                      <Chip
                        variant="outlined"
                        color={row.type == "income" ? "success" : "primary"}
                        icon={
                          row.type == "income" ? (
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
                      <Chip
                        label={row.categary}
                        component="a"
                        href="#basic-chip"
                        variant="outlined"
                        clickable
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`history/${row.user_id}/${row.id}`}
                        style={{
                          color:
                            theme.palette.mode === "dark" ? "white" : "gray",
                        }}
                      >
                        <ModeEditOutlineIcon onClick={handleEdit} />
                      </Link>

                      <DeleteIcon
                        onClick={() => handleDelete(row.id, row.user_id)}
                        sx={{
                          color:
                            theme.palette.mode === "dark" ? "white" : "gray",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          // Mobile View (Stacked List)
          <Box sx={{ p: 2 }} className="mobileboxhistory">
            {coppytransactions.map((elm) => {
              return (
                <>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: "#f9f9f9",
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#333" : "#fff",
                    }}
                  >
                    <strong>Type:</strong> &nbsp;{elm.categary}
                    <br />
                    <strong>Note:</strong> &nbsp;{elm.note} <br />
                    <strong>Amount:</strong>&nbsp;₹{elm.amount}
                    <br />
                    <strong>Date:</strong>&nbsp;{elm.created_at}
                    <br />
                    <strong>Category:</strong>&nbsp;{elm.categary}
                    <TableCell>
                      <Link href={`history/${elm.user_id}/${elm.id}`}>
                        <ModeEditOutlineIcon onClick={handleEdit} />{" "}
                      </Link>
                      <DeleteIcon
                        onClick={() => handleDelete(elm.id, elm.user_id)}
                      />
                    </TableCell>
                  </Paper>
                </>
              );
            })}
          </Box>
        )}
      </TableContainer>
    </div>
  );
};

export default Historytable;
