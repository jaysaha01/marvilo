import React from 'react'
import SignInForm from '@/components/SignInForm'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

const page = () => {
  return (
    <div className="signupcomponet">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid size={{ xs: 12, md: 8 }} >
              <div className="sideone">
              <SignInForm />
              </div>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <div className="sidetwo sidesignin">
              </div>
              </Grid>
          </Grid>
        </Box>
    </div>
  )
}

export default page
