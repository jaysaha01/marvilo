import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
    <XAxis dataKey="formattedDate" />
    <Tooltip />
    <Legend />
    <Bar
      dataKey="amount"
      fill="#3457D5"
      activeBar={<Rectangle fill="pink" stroke="blue" />}
      label={({ x, y, width, value, index }) => {
        const category = mydata[index]?.categary;
        return (
          <text
            x={x + width / 2}
            y={y - -60}
            fill="white"
            textAnchor="middle"
            fontSize={20}
          >
            {category}
          </text>
        );
      }}
    />
  </BarChart>
</ResponsiveContainer>
    </div>
  );
};

export default Mybarchart;
