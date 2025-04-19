"use client";

import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { addUser } from "../../service/apiUser";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

type Inputs = {
  email: string;
  password: string;
};

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter(); 

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const cratedata = await addUser(data);

      if (cratedata.user?.role == "authenticated") {
        router.push("/signin");
        
      } else {
        toast.error('User is not Created !', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      }
    } catch {}
  };

  function handleClick(){
    router.push("/signin")
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
        <div className="logo">🐱‍🏍</div>
        <Typography component="h1" variant="h5">
          Create Your Account
        </Typography>
        <Typography component="h5" variant="h5">
          Please enter your details
        </Typography>
     
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
            <span>email Ex: jsmith45@company.com</span>
          )}
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            {...register("password", {
              required: true,
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
            })}
          />
          {errors?.password?.type === "required" && (
            <span>Password is required !</span>
          )}
          {errors?.password?.type === "pattern" && (
            <span>password Ex: Abc@1234</span>
          )}

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
            You have an account? <a onClick={handleClick} style={{cursor:"pointer"}}>Sign In</a>
          </Typography>
          
        </Box>
      </Box>
    </Container>
  );
};

export default SignupForm;
