"use client";

import React, { useEffect, useState } from "react";
import { gettingUser } from "../../service/apiUser";
import { rendermyCatagory } from "../../service/apiTracker";
import Mycatagorycard from "./Mycatagorycard";
import Box from "@mui/material/Box";
import { Grid2 } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

interface catagoryface {
  created_at: string;
  id: string;
  name: string;
  type: string;
  user_id: string | null;
}

const Mycategory = () => {
  const [catagory, setMycatagory] = useState<catagoryface[] | []>([]);

  useEffect(() => {
    gettingUser()
      .then((mydata) => {
        if (mydata?.id) {
          rendermyCatagory()
            .then((elm) => {
              const myallcatagory = elm;
              const myfilterdcatagory = myallcatagory?.filter((elm) => {
                return elm.user_id === null || elm.user_id === mydata?.id;
              });

              setMycatagory(myfilterdcatagory ?? []);
            })
            .catch((error) =>
              console.error("Error fetching categories:", error)
            );
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [catagory]);

  const theme = useTheme();

  return (
    <div>
      <React.Fragment>
        <Box sx={{ flexGrow: 1 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <div
                className="addingbox"
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#333" : "#403f3f0f",
                }}
              >
                <Link href={"category/add-categories"}>
                  <AddIcon />
                </Link>
              </div>
            </Grid2>
            {catagory.map((elm) => {
              return (
                <Grid2 size={{ xs: 12, md: 4 }} key={elm.id}>
                  <Mycatagorycard mydata={elm} />
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      </React.Fragment>
    </div>
  );
};

export default Mycategory;
