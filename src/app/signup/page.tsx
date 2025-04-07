import React from "react";
import SignupForm from "@/components/SignupForm";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

const page = () => {
  return (
    <div className="signupcomponet">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, md: 8 }} >
              <div className="sideone">
              <SignupForm />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>

              <div className="sidetwo">
              
              </div>
              
              </Grid>
          </Grid>
        </Box>
      
    </div>
  );
};

export default page;
