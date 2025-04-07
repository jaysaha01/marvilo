import React from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
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

const Achart: React.FC<AchartProps> = ({ mydata }) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
    
      <AreaChart
        width={530}
        height={350}
        data={mydata}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="categary" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="amount"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </div>
  );
};

export default Achart;
