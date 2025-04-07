"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { gettingUser } from "../../service/apiUser";
import { addTransations, rendermyCatagory } from "../../service/apiTracker";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import { myAuth } from "../../hooks/myAuth";

type Inputs = {
  ttype: string;
  note: string;
  amount: number;
  mycategory: string;
  mydate: Date;
};

const Addtransactions = () => {
  let [mycatagory, setMycatagory] = useState<{ id: string; name: string }[]>(
    []
  );

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gettingUser().then((mydata) => {
     
      if (mydata?.id) {
        rendermyCatagory().then((elm) => {
          let myallcatagory = elm;
          let myfilterdcatagory = myallcatagory?.filter((elm) => {
            return elm.user_id === null || elm.user_id === mydata?.id;
          });
          setMycatagory(myfilterdcatagory ?? []);
        });
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset, // Reset the form after successful submission
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    gettingUser().then((user) => {
      if (user?.id) {
        addTransations(data, user?.id)
          .then((response) => {
            let res = response;

            if (res?.length) {
              toast.success("Transaction added Successfully !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              reset(); // Reset the form after successful submission
            } else {
              toast.error("Transaction is not Added !", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const { loading } = myAuth();

  return (
    <div className="addtransactions">
      <Container maxWidth="sm">
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Typography component="h1" variant="h5">
              Add Transactions
            </Typography>
            <FormControl fullWidth error={!!errors.ttype}>
              <InputLabel id="category-label">Transaction Type</InputLabel>
              <Select
                sx={{ mb: 2 }}
                labelId="category-label"
                id="category-label"
                defaultValue=""
                {...register("ttype", { required: true })}
              >
                <MenuItem value="">Select Your Category</MenuItem>
                <MenuItem value={"expense"}>Expenses</MenuItem>
                <MenuItem value={"income"}>Income</MenuItem>
              </Select>
              {errors?.ttype?.type === "required" && (
                <span> Transaction Type !</span>
              )}
            </FormControl>

            <TextField
              error={!!errors.amount}
              sx={{ mb: 2 }}
              fullWidth
              label="Amount"
              type="number"
              id="typecatagory"
              {...register("amount", { required: true })}
            />
            {errors?.amount?.type === "required" && (
              <span>Amount is required !</span>
            )}

            {/* learn this form control  */}
            <FormControl fullWidth error={!!errors.mycategory} sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Controller
                name="mycategory"
                control={control}
                defaultValue=""
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select {...field} label="Category">
                    <MenuItem value="">Select Category</MenuItem>
                    {mycatagory?.map((elm) => (
                      <MenuItem key={elm.id} value={elm.name}>
                        {elm.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors?.mycategory?.type === "required" && (
                <span>Category is required !</span>
              )}
            </FormControl>

            <TextField
              error={!!errors.note}
              sx={{ mb: 2 }}
              fullWidth
              type="text"
              id="name"
              label="Note"
              autoComplete="off"
              {...register("note", { required: true })}
            />
            {errors?.note?.type === "required" && (
              <span>Note is required !</span>
            )}

            <TextField
            error={!!errors.mydate}
              // label="Date"
              type="date"
              fullWidth
              {...register("mydate", { required: "Date is required!" })}
              sx={{ mb: 2 }}
            />

            {/* <input type="date" {...register("mydate", { required: true })} /> */}
            {errors?.mydate?.type === "required" && (
              <span>Date is required !</span>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Addtransactions;
