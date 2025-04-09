"use client";

import React, { useEffect, useState } from "react";
import { gettingUser } from "../../service/apiUser";
import { renderMyTransactions } from "../../service/apiTracker";
import { renderbudget } from "../../service/apiTracker";
import { Box, Grid2 } from "@mui/material";
import Budgetcard from "./Budgetcard";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { addBudgett } from "../../service/apiTracker";
import { myAuth } from "../../hooks/myAuth";

type Inputs = {
  amount: number;
  mycategory: string;
  mydate: Date;
};

import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { rendermyCatagory } from "../../service/apiTracker";
import Select from "@mui/material/Select";
import moment from "moment";

interface mytransationtype {
  amount: number;
  categary: string;
  created_at: string;
  id: string;
  note: string;
  type: string;
  user_id: string;
  newdata: string;
}

interface mybudgetype {
  created_at: string;
  amount: number;
  category: number;
  user_id: number;
}


export interface totalBugetype {
  budgetAmount: number;
  category: string;
  isOverBudget: boolean;
  month: string;
  percentage: string;
  remaining: number;
  spentAmount: number;
  mydate: string;
}

interface filteredType {
  categary: string;
  modified_date: string;
  mdate: string;
  type: string;
  total_amount: number;
};

interface filteredType {
  categary: string;
  modified_date: string;
  total_amount: number;
  mdate: string;
  type: string;
}

interface budgetgrouptype {
  categary: string,
  modified_date: string,
  mdate: string,
  type: string,
  total_amount: number
}

interface groupkicu {
  categary: string;
  modified_date: string;
  total_amount: number;
  mdate: string;
  type: string;
}


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Budget = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<mytransationtype[]>([]);
  const [, setftransaction] = useState<mytransationtype[]>([]);
  const [budget, setBudget] = useState<mybudgetype[] | []>([]);

  const [filteredTransactions, setFilteredTransactions] = useState<filteredType[]>([]); //Modified transaction arrary object
  const [filteredBudget, setFilteredBudget] = useState<filteredType[]>([]); //Modified Budget arrary object

  const [budgetAnaysis, setBudgetAnaysis] = useState<totalBugetype[]>([]); //Budget analysis report

  const [, setMycatagory] = useState<{ id: string; name: string }[]>(
    []
  );

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Fetching transaction user wise ------------------------
  async function fetchTransactionData() {
    try {
      const mydata = await gettingUser();

      if (mydata?.id) {
        const allTransactions = await renderMyTransactions();
        const allUserBudgets = await renderbudget();

        if (!allTransactions) {
          setTransactions([]);
          return;
        }

        const filteredTransactions = allTransactions.filter(
          (elm: mytransationtype) =>
            elm.user_id === null || elm.user_id === mydata.id
        );

        // Fix: Ensure filterdBudget is never undefined
        const filterdBudget =
          allUserBudgets?.filter(
            (elm) => elm.user_id === null || elm.user_id === mydata.id
          ) ?? [];

        rendermyCatagory().then((elm) => {
          const myallcatagory = elm;
          const myfilterdcatagory = myallcatagory?.filter((elm) => {
            return elm.user_id === null || elm.user_id === mydata?.id;
          });

          setMycatagory(myfilterdcatagory ?? []);
        });

        setTransactions(filteredTransactions);
        setftransaction(filteredTransactions);

        setBudget(filterdBudget);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }

  useEffect(() => {
    fetchTransactionData();
  }, []);

  //Addin extra column of modified data like "March 2025" and Find out categroywise and month wise total tracsactions using moment js---------------

  useEffect(() => {
    const groupedData: { [key: string]: budgetgrouptype } = {};
    transactions.forEach((txn) => {
      const modifiedDate = moment(txn.created_at).format("MMMM YYYY");
      const key = `${txn.categary}-${txn.type}-${modifiedDate}-${txn.created_at}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          categary: txn.categary,
          modified_date: modifiedDate,
          mdate: txn.created_at,
          type: txn.type,
          total_amount: 0,
        };
      }
      groupedData[key].total_amount += txn.amount;
    });
    setFilteredTransactions(Object.values(groupedData));
  }, [transactions]);


  //Addin extra column of modified data like "March 2025" and Find out categroywise and month wise total budget using moment js---------------


  useEffect(() => {
    function makeModifiedBudget() {

      const budgetgroupedData: { [key: string]: groupkicu } = {};


      budget.forEach((elm) => {
        const modifiedDate = moment(elm.created_at).format("MMMM YYYY");
        const key = `${elm.category}-${modifiedDate}-${elm.created_at}`;

        if (!budgetgroupedData[key]) {
          budgetgroupedData[key] = {
            categary: String(elm.category),
            modified_date: modifiedDate,
            total_amount: 0,
            mdate: elm.created_at,
            type: "expense"
          };
        }

        budgetgroupedData[key].total_amount += elm.amount;
      });


      setFilteredBudget(Object.values(budgetgroupedData));


    }

    makeModifiedBudget();
  }, [budget]);

  console.log(filteredBudget, '🥞🧀🍗')

  //Create Analysis data.....................




  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset, // add this
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const user = await gettingUser();
      if (user?.id) {
        await addBudgett(data, user?.id);

        await fetchTransactionData();
        handleClose();
        reset();
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  useEffect(() => {
    if (filteredTransactions.length > 0 && filteredBudget.length > 0) {
      const createBudget = () => {
        const expenseTransactions = filteredTransactions.filter(
          (txn) => txn.type === "expense"
        );

        const budgetAnalysisArray = filteredBudget.map((budgetItem) => {
          const spentItem = expenseTransactions.find(
            (txn) =>
              txn.categary === budgetItem.categary &&
              txn.modified_date === budgetItem.modified_date
          );


          const spentAmount = spentItem ? spentItem.total_amount : 0;
          const budgetAmount = budgetItem.total_amount;
          const remaining =
            budgetAmount - spentAmount > 0 ? budgetAmount - spentAmount : 0;
          const percentage = Math.round((spentAmount / budgetAmount) * 100) > 100 ? 100 : Math.round((spentAmount / budgetAmount) * 100);
          const isOverBudget = spentAmount > budgetAmount;


          return {
            budgetAmount,
            category: budgetItem.categary,
            isOverBudget,
            month: budgetItem.modified_date,
            percentage: `${percentage.toFixed(0)}%`,
            remaining,
            spentAmount,
            mydate: budgetItem.mdate,
          };
        });

        setBudgetAnaysis(budgetAnalysisArray);
      };

      createBudget();
    }
  }, [filteredTransactions, filteredBudget]);


  myAuth();

  console.log("fdfdfdfsfdsf🍕🍕🍕🍕", filteredBudget)


  return (
    <div className="budgetchild">
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <div
                className="addingbox"
                onClick={handleOpen}
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#403f3f0f",
                  cursor: "pointer",
                }}
              >
                <AddIcon />
              </div>

              <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                className="modalbox"
              >
                <Box sx={style} className="modalinnner" style={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "#181818"
                      : "white",
                  border: theme.palette.mode === "dark" ? "1px solid gray" : "",

                }}>
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}

                  >
                    <TextField
                      error={!!errors.amount}
                      margin="normal"
                      fullWidth
                      label="Amount"
                      type="number"
                      id="typecatagory"
                      {...register("amount", { required: true })}
                      style={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#b3aeaf"
                            : "#403f3f0f",
                      }}
                    />
                    {errors?.amount?.type === "required" && (
                      <span style={{ color: "red" }}>
                        {" "}
                        Amount is required Type !
                      </span>
                    )}

                    <FormControl
                      fullWidth
                      error={!!errors.mycategory}
                      sx={{ mb: 1.3 }}
                      style={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#b3aeaf"
                            : "#403f3f0f"
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Controller
                        name="mycategory"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Category is required" }}
                        render={({ field }) => {
                          // Get unique expense categories from transactions
                          const expenseCategories = Array.from(
                            new Set(
                              transactions
                                .filter((elm) => elm.type === "expense")
                                .map((elm) => elm.categary)
                            )
                          );

                          return (
                            <Select {...field} label="Category">
                              <MenuItem value="">Select Category</MenuItem>
                              {expenseCategories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                  {cat}
                                </MenuItem>
                              ))}
                            </Select>
                          );
                        }}
                      />
                    </FormControl>

                    {errors?.mycategory?.type === "required" && (
                      <span style={{ color: "red" }}>
                        {" "}
                        Category is required !
                      </span>
                    )}
                    <br />

                    <TextField
                      error={!!errors.mydate}
                      // label="Date"
                      type="date"
                      fullWidth
                      {...register("mydate", { required: "Date is required!" })}

                      style={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#b3aeaf"
                            : "#403f3f0f"
                      }}
                    />

                    {errors?.mydate?.type === "required" && (
                      <span style={{ color: "red" }}> Date is required !</span>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 1.3, mb: 2, p: 2 }}
                      className="modebutton"
                    >
                      Set Budget
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Grid2>

            {budgetAnaysis.map((elm) => {
              return (
                <Grid2
                  size={{ xs: 12, md: 4 }}
                  key={`${elm.category}-${elm.mydate}`}
                >
                  <Budgetcard data={elm} setpBudget={setBudgetAnaysis} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </React.Fragment>
    </div>
  );
};

export default Budget;
