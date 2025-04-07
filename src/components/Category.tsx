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
import { gettingUser } from "../../service/apiUser";
import { addCategory } from "../../service/apiTracker";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

type Inputs = {
  namecategory: string;
  typecategory: string;
  mydate: string;
};

const Category: React.FC = () => {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    gettingUser().then((mydata) => {
      if (mydata?.id) {
        addCategory(data, mydata.id).then(() => {
          toast.success("Category added Successfully!", {
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
        reset();
      }
    });
  };

  return (
    <Container
      maxWidth="sm"
      className="catagroyform"
      style={{
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#403f3f0f",
        cursor: "pointer",
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
          Add Your Catagory
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Category Name"
            autoComplete="off"
            {...register("namecategory", { required: true })}
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "gray" : "white",
              cursor: "pointer",
            }}
          />
          {errors?.namecategory?.type === "required" && (
            <p style={{ color: "red" }}>Category Name is required !</p>
          )}

          <input
            style={{ display: "none" }}
            type="date"
            value={new Date().toISOString().split("T")[0]}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="modebutton"
          >
            create catagory
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Category;
