import React from "react";  
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";  
import { ProcessItem } from "../types";  
  
type Props = {  
  data: ProcessItem[];  
};  
  
const ProgressChart: React.FC<Props> = ({ data }) => {  
  const chartData = data.map((d) => ({  
    name: d.id,  
    label: `${d.name}`,  
    progress: Math.round(d.progress),  
    status: d.status,  
  }));  
  
  const color = (status: ProcessItem["status"]) =>  
    status === "blocked" ? "#e11d48" : status === "delayed" ? "#f59e0b" : status === "completed" ? "#64748b" : "#10b981";  
  
  return (  
    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">  
      <div className="text-lg font-semibold mb-2">進捗バー（%）</div>  
      <div className="h-72">  
        <ResponsiveContainer width="100%" height="100%">  
          <BarChart data={chartData} margin={{ left: 8, right: 8 }}>  
            <XAxis dataKey="name" fontSize={12} />  
            <YAxis unit="%" fontSize={12} />  
            <Tooltip  
              contentStyle={{ fontSize: 12 }}  
              formatter={(value: any, name: any, props: any) => {  
                return [`${value}%`, props.payload.label];  
              }}  
              labelFormatter={(label) => `工程ID: ${label}`}  
            />  
            <Bar dataKey="progress" radius={[4, 4, 0, 0]}>  
              {chartData.map((entry, index) => (  
                <Cell key={`cell-${index}`} fill={color(entry.status)} />  
              ))}  
            </Bar>  
          </BarChart>  
        </ResponsiveContainer>  
      </div>  
    </div>  
  );  
};  
  
export default ProgressChart;  
