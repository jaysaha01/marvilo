"use client";
import React from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { resetPassword } from "../../../service/apiTracker";
import { useRouter } from 'next/navigation';

type Inputs = {
  password: string;
};

const Category: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {

    resetPassword(data.password).then((elm) => {
      console.log(elm)
      router.push('/signin');
    }).catch((err) => {
      toast.error(`${err}Password Not Update !`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    })

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
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="New Password"
            autoComplete="off"
            {...register("password", { required: true })}
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "gray" : "white",
              cursor: "pointer",
            }}
          />
          {errors?.password?.type === "required" && (
            <p style={{ color: "red" }}>Password is required !</p>
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

export default Category;
