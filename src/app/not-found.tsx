import Link from "next/link";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Grid2 } from "@mui/material";

export default function NotFound() {
  return (
    <div>
      <div className="loading">
        <>
          <CssBaseline />
          <Container>
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <div className="imgbx imgbxtwo">
                  <img src="./404.png" />
                  <Link href="/">Return Home</Link>
                </div>
              </Grid2>
            </Grid2>
          </Container>
        </>
      </div>
    </div>
  );
}
