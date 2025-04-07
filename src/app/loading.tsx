import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Grid2 } from "@mui/material";

export default function Loading() {
  return (
    <>
      <div className="loading">
        <React.Fragment>
          <CssBaseline />
          <Container>
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <div className="imgbx">
                  <img src="./nodata.png" />
                  <h2>Please! Add Your Transactions</h2>
                </div>
              </Grid2>
            </Grid2>
          </Container>
        </React.Fragment>
      </div>
    </>
  );
}
