
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useTheme } from "@mui/material/styles";

interface cardpropstype {
  type: string;
  amount: number
}
const Mycard: React.FunctionComponent<cardpropstype> = (props) => {

  const theme = useTheme();

  let { type, amount } = props
  return (
    <div>
      <Card  className="carddsn" style={{ border: theme.palette.mode === "dark" ? "2px solid #333" : "2px solid #a8a4a44a", }}>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }} className='fonts' style={{ color: theme.palette.mode === "dark" ? "white" : "black", }}>
            {type}
          </Typography>
          <Typography variant="h5" component="div" sx={{ color: 'text.secondary', fontSize: 50 }} className='font5'>
            ₹{amount}
          </Typography>
        </CardContent>
        <CardActions className='buttonbx'>
          <div className='iconbx'>

            {type == "Income" ? <AttachMoneyIcon /> : type == "Expenses" ? <SouthWestIcon/> : type == "Balance" ? <SentimentVerySatisfiedIcon/> : null}
            {type == "Monthly Income" ? <AttachMoneyIcon /> : type == "Monthly Expenses" ? <SouthWestIcon/> : type == "Monthly Balance" ? <SentimentVerySatisfiedIcon/> : null}
          </div>
        </CardActions>
      </Card>

    </div>
  )
}

export default Mycard
