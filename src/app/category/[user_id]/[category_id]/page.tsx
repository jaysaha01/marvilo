"use client";
import React, { useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import { rendermyCatagory } from "../../../../../service/apiTracker";
import { editCatagory } from "../../../../../service/apiTracker";
import { myAuth } from "../../../../../hooks/myAuth";

type Inputs = {
  namecategory: string;
  mydate: string;
};

const Page: React.FC = () => {
  const theme = useTheme();
  const paramss = useParams() as Record<string, string | undefined>;
  const user_id = paramss?.user_id || "";
  const category_id = paramss?.category_id || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("Updated Data:", data, user_id, category_id);
    editCatagory(data, user_id, category_id);
    toast.success("Category updated successfully!");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const allCategories = await rendermyCatagory();
        const filteredCategories = (allCategories ?? []).filter(
          (elm) => elm.user_id === user_id && elm.id === category_id
        );

        if (filteredCategories.length > 0) {
          setValue("namecategory", filteredCategories[0].name || "");
          setValue("mydate", filteredCategories[0].created_at.split("T")[0]);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }
    fetchData();
  }, [user_id, category_id, setValue]);

  myAuth();

  return (
    <Container
      maxWidth="sm"
      className="catagroyform"
      style={{
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#403f3f0f",
        cursor: "pointer",
      }}
    >
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
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Edit Your Catagory
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            // label="Category Name"
            autoComplete="off"
            {...register("namecategory", { required: true })}
            style={{
              backgroundColor: theme.palette.mode === "dark" ? "gray" : "white",
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
            Update catagory
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;
