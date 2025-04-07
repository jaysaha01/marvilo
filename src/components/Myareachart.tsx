import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MyBarChartProps {
  data: { category: string; amount: number }[]; // Define 'data' explicitly
}

const Myareachart: React.FC<MyBarChartProps> = ({ data }) => {
  return (
    <div className="barchart">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            fill="#279d85"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Myareachart;
