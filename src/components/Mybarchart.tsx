import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

interface AchartProps {
  mydata: mytransationtype[];
}


const Mybarchart: React.FC<AchartProps> = ({ mydata }) => {
  return (
    <div className="barchart">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={400}
          data={mydata}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categary" /> 
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="amount"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Mybarchart;
