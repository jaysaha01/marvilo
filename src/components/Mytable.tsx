import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Box,
} from "@mui/material";

import Chip from "@mui/material/Chip";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useTheme } from "@mui/material/styles";

interface mytransationtype {
  amount: number;
  categary: string;
  created_at: string;
  id: string;
  modified_date:string
  note: string;
  type: string;
  user_id: string;
}
interface MyTableProps {
  tdata: mytransationtype[]; 
}

const Mytable: React.FC<MyTableProps> = ({ tdata }) => {
  const isMobile = useMediaQuery("(max-width:600px)"); 
  const theme = useTheme();
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      {!isMobile ? (
        // Desktop Table View
        <Table aria-label="desktop responsive table">
          <TableHead >
            <TableRow sx={{ backgroundColor: theme.palette.mode === "dark" ? "#333" : "#403f3f4a", }}>
              <TableCell>Type</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Categary</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tdata.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                <Chip variant="outlined" color={row.type =="income" ? "success":"primary"} icon={row.type =="income" ? <AttachMoneyIcon />:<ThumbDownAltIcon/> } label={row.type} />
                </TableCell>
                <TableCell>
                {row.note}
                </TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell><Chip
                      label={row.categary}
                      component="a"
                      href="#basic-chip"
                      variant="outlined"
                      clickable
                    /></TableCell>
                   <TableCell>
                {row.modified_date}
                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        // Mobile View (Stacked List)
        <Box sx={{ p: 2 }} >
          {tdata.map((row) => (
            <Paper key={row.id} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.mode === "dark" ? "#333" : "#403f3f4a" }}>
              <strong>Type:</strong> {row.type} <br />
              <strong>Note:</strong> {row.note} <br />
              <strong>Amount:</strong> {row.amount}<br />
              <strong>Category:</strong> {row.categary}<br />
            </Paper>
          ))}
        </Box>
      )}
    </TableContainer>
  );
};

export default Mytable;
