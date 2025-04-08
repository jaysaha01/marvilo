"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "next/navigation";
import {
  rendermyCatagory,
  renderMyTransactions,
  editTransaction,
} from "../../../../../service/apiTracker";
import { myAuth } from "../../../../../hooks/myAuth";

type Inputs = {
  ttype: string;
  note: string;
  amount: number;
  mycategory: string;
  mydate: string;
};

const Page = () => {
  
  const params = useParams() as { user_id?: string; transaction_id?: string };
  const user_id = params.user_id || "";
  const transaction_id = params.transaction_id || "";

  const [myCategory, setMyCategory] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedTtype, setSelectedTtype] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Inputs>();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const allCategories = await rendermyCatagory();
        const filteredCategories = allCategories?.filter(
          (elm) => elm.user_id === null || elm.user_id === user_id
        );
        setMyCategory(filteredCategories ?? []);

        // Fetch transaction details
        const allTransactions = await renderMyTransactions();
        const transaction = allTransactions?.find(
          (elm) => elm.user_id === user_id && elm.id === transaction_id
        );

        if (transaction) {
          setValue("note", transaction.note || "");
          setValue("amount", transaction.amount || 0);
          setValue("mydate", transaction.created_at.split("T")[0]); // Extract date only

          setSelectedTtype(transaction.type || "");
          setSelectedCategory(transaction.category || "");
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    }

    fetchData();
  }, [user_id, transaction_id, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("Updated Data:", data, user_id, transaction_id);
    await editTransaction(data, user_id, transaction_id);
    toast.success("Transaction updated successfully!");
  };

   myAuth();

  // ✅ Handle missing parameters gracefully
  if (!user_id || !transaction_id) {
    console.error("Missing required parameters: user_id or transaction_id");
    return <p>Error: Missing required parameters.</p>;
  }

  return (
    <div className="addtransactions">
      <Container maxWidth="sm">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1>Edit Transaction</h1>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* ✅ Transaction Type - Controlled from the start */}
            <FormControl fullWidth error={!!errors.ttype} sx={{ mb: 2 }}>
              {/* <InputLabel>Transaction Type</InputLabel> */}
              <Select
                {...register("ttype", {
                  required: "Transaction Type is required!",
                })}
                value={selectedTtype}
                onChange={(e) => setSelectedTtype(e.target.value)}
              >
                <MenuItem value="">Select Transaction Type</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="income">Income</MenuItem>
              </Select>
              {errors.ttype && <span>{errors.ttype.message}</span>}
            </FormControl>

            <TextField
              // label="Note"
              error={!!errors.note}
              sx={{ mb: 2 }}
              fullWidth
              {...register("note", { required: "Note is required!" })}
            />
            {errors.note && <span>{errors.note.message}</span>}

            <TextField
              // label="Amount"
              error={!!errors.amount}
              sx={{ mb: 2 }}
              fullWidth
              type="number"
              {...register("amount", { required: "Amount is required!" })}
            />
            {errors.amount && <span>{errors.amount.message}</span>}

            {/* ✅ Category - Controlled from the start */}
            <FormControl fullWidth error={!!errors.mycategory} sx={{ mb: 2 }}>
              {/* <InputLabel>Category</InputLabel> */}
              <Select
                {...register("mycategory", {
                  required: "Category is required!",
                })}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Select Category</MenuItem>
                {myCategory?.map((elm) => (
                  <MenuItem key={elm.id} value={elm.name}>
                    {elm.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.mycategory && <span>{errors.mycategory.message}</span>}
            </FormControl>

            <TextField
              // label="Date"
              type="date"
              fullWidth
              {...register("mydate", { required: "Date is required!" })}
              sx={{ mb: 2 }}
            />
            {errors.mydate && <span>{errors.mydate.message}</span>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update Transaction"}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Page;
