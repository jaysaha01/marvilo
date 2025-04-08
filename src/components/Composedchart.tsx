
import React from "react";
import { ComposedChart, XAxis, YAxis,Tooltip, Legend, CartesianGrid, Area, Bar, Line } from "recharts";


  interface Transaction {
    amount: number;
    categary: string;
    created_at: string;
    id: string;
    note: string;
    type: "income" | "expense";
    user_id: string;
    formattedDate?: string;
  }
  
  interface AchartProps {
    mydata: Transaction[];
  }
  

const Composedchart: React.FC<AchartProps> = ({ mydata }) => {
  return (
    <div>
      <ComposedChart width={530} height={400} data={mydata}>
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <CartesianGrid stroke="#f5f5f5" />
        <Area type="monotone" dataKey="amount" fill="#B03052" stroke="#8884d8" />
        <Bar dataKey="amount" barSize={20} fill="#B03052" />
        <Line type="monotone" dataKey="categary" stroke="#ff7300" />
      </ComposedChart>
    </div>
  );
};

export default Composedchart;
