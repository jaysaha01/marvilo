"use client";

import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form";
import { enterUser } from '../../service/apiUser';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from "next/navigation";
import Loginbtn from './Loginbtn';

type Inputs = {
  email: string,
  password: string,
};

const SignInForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    try {
      const cratedata = await enterUser(data);
      if (cratedata.session?.access_token) {
        router.push("/");
      } else {
        toast.error('Failed to Login 😢 !', {
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
    } catch {
      // Optional: Add error toast if needed
    }
  };

  function handleClick() {
    router.push("/signup");
  }

  return (
    <Container maxWidth="sm" className="signupform">
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
        theme="colored"
      />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="logo">🙈</div>
        <Typography component="h1" variant="h5">
          Login Your Account
        </Typography>
        <Typography component="h5" variant="h5">
          Please enter your details
        </Typography>

        <Loginbtn />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="off"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
            })}
          />
          {errors?.email?.type === "required" && (
            <span>Email is required !</span>
          )}
          {errors?.email?.type === "pattern" && (
            <span>Email example: jsmith@company.com</span>
          )}

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            {...register("password")}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="formbtn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>

          <Typography variant="subtitle1" gutterBottom>
            You don&rsquo;t have an account?{" "}
            <a onClick={handleClick} style={{ cursor: "pointer" }}>Sign Up</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInForm;
