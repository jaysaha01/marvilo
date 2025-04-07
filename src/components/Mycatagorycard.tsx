import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EditIcon from "@mui/icons-material/Edit";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useTheme } from "@mui/material/styles";
import { deletemyCatagory } from "../../service/apiTracker";
import Link from "next/link";


interface catagoryface {
  created_at: string;
  id: string;
  name: string;
  type: string;
  user_id: string | null;
}

interface totainterface {
  mydata: catagoryface;
}

const Mycatagorycard: React.FC<totainterface> = ({ mydata }) => {
  function handledelete(id: string, user_id: string | null) {
    if (!user_id) {
      alert("User ID is missing. Cannot delete.");
      return;
    }
    deletemyCatagory(id, user_id);

  }

  const theme = useTheme();

  return (

    <Card sx={{ maxWidth: 345 }} className="mycatagorybx" style={{ border: theme.palette.mode === "dark" ? "2px solid #4e4e4e" : "2px solid #dedee1", }}>
      <CardContent>
        <DashboardCustomizeIcon />
        <Typography gutterBottom variant="h5" component="div">
          {mydata.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {mydata.type}
        </Typography>
      </CardContent>
      <CardActions>
        <div className="boxies">
          {mydata.user_id && (
            <>
            <Link href={`category/${mydata.user_id}/${mydata.id}`}><EditIcon className="edit" /></Link>
              <BackspaceIcon
                className="delete"
                onClick={() => handledelete(mydata.id, mydata.user_id)}
              />
            </>
          )}
        </div>
      </CardActions>
    </Card>
  );
};

export default Mycatagorycard;
