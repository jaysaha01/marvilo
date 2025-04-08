"use client";
import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { forgetPassword } from "../../../service/apiTracker";

type Inputs = {
  email: string;
};

const ForgetPassword: React.FC = () => {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    forgetPassword(data.email)
      .then((elm) => {
        console.log(elm)
        toast.success("Recovery Link Sent to your MailID", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        reset();
      })
      .catch((err) => {
        toast.error(`${err}Recovery Email Not Send!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <Container
      maxWidth="sm"
      className="catagroyform"
      style={{
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#403f3f0f",
        cursor: "pointer",
        marginTop:"40px",
       
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Forget Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Enter Your email"
            autoComplete="off"
            {...register("email", { required: true })}
            style={{
              backgroundColor: theme.palette.mode === "dark" ? "gray" : "white",
              cursor: "pointer",
            }}
          />
          {errors?.email?.type === "required" && (
            <p style={{ color: "red" }}>Email is required !</p>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="modebutton"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
