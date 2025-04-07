"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CategoryIcon from "@mui/icons-material/Category";
import { useTheme } from "@mui/material/styles";
import { deletebudget } from "../../service/apiTracker";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

export interface totalBugetype {
  budgetAmount: number;
  category: string;
  isOverBudget: boolean;
  month: string;
  percentage: string;
  remaining: number;
  spentAmount: number;
  mydate: string; // This is the key part!
}

interface mybudgetproptype {
  data: totalBugetype;
  setpBudget: React.Dispatch<React.SetStateAction<totalBugetype[]>>; // Modify the type to match state setter function
}

const Budgetcard: React.FC<mybudgetproptype> = ({ data, setpBudget }) => {
  const { user } = useAuth();

  let userid = user?.id;

  function handleDelete(mycname: string) {
    toast.success("Budget deleted Successfully!", {
      theme: "dark",
    });
  
    if (!userid) return;

    deletebudget(mycname, data.mydate, userid);
  
    setpBudget((prev) => {
      return prev.filter((elm) => elm.category !== mycname || elm.mydate !== data.mydate);
    });
  }
  

  const theme = useTheme();
  return (
    <div>
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
      <Card className="budgetcard">
        <CardContent>
          <div className="budercheader">
            <div className="boxone">
              <div className="icone">
                <CategoryIcon />
              </div>
              <Typography
                variant="body2"
                style={{
                  color: theme.palette.mode === "dark" ? "white" : "black",
                }}
              >
                {data.category}
              </Typography>
              <span>({data.month})</span>
            </div>

            <div className="boxtwo">
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ₹{data.budgetAmount}
              </Typography>
            </div>
          </div>
          <div className="budgettext">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ₹ {data.spentAmount} Spent
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ₹ {data.remaining} Remaining
            </Typography>
          </div>

          <div className="cardbody">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${data.percentage}` }}
              ></div>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            className="dlt"
            onClick={() => handleDelete(data.category)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Budgetcard;
