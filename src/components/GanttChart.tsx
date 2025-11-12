import React, { useMemo } from "react";  
import {  
  ResponsiveContainer,  
  BarChart,  
  Bar,  
  XAxis,  
  YAxis,  
  Tooltip,  
  ReferenceLine,  
  Cell,  
} from "recharts";  
import { ProcessItem } from "../types";  
  
/* 簡易ガント: オフセットバー(透明) + 実バー をstackし水平時間軸で表現 */  
type Props = {  
  data: ProcessItem[];  
};  
  
function hoursBetween(a: Date, b: Date) {  
  return (a.getTime() - b.getTime()) / 3600000;  
}  
  
const GanttChart: React.FC<Props> = ({ data }) => {  
  const { chartData, minTime, maxTime } = useMemo(() => {  
    if (data.length === 0) {  
      const now = new Date();  
      return {  
        chartData: [],  
        minTime: now,  
        maxTime: new Date(now.getTime() + 3600000),  
      };  
    }  
    const min = new Date(Math.min(...data.map((d) => new Date(d.plannedStart).getTime())));  
    const max = new Date(Math.max(...data.map((d) => new Date(d.plannedEnd).getTime())));  
    const marginH = 0.25; // 15分分バッファ  
    const minTime = new Date(min.getTime() - marginH * 3600000);  
    const maxTime = new Date(max.getTime() + marginH * 3600000);  
  
    const rangeHours = hoursBetween(maxTime, minTime);  
  
    const cd = data.map((d) => {  
      const plannedStart = new Date(d.plannedStart);  
      const plannedEnd = new Date(d.plannedEnd);  
      const actualStart = d.actualStart ? new Date(d.actualStart) : undefined;  
      const actualEnd = d.actualEnd ? new Date(d.actualEnd) : undefined;  
  
      const startOffset = Math.max(0, hoursBetween(plannedStart, minTime));  
      const plannedDuration = Math.max(0.01, hoursBetween(plannedEnd, plannedStart));  
  
      const actualStartOffset = actualStart ? Math.max(0, hoursBetween(actualStart, minTime)) : undefined;  
      const actualDuration =  
        actualStart && (actualEnd ?? new Date()) ? Math.max(0.01, hoursBetween(actualEnd ?? new Date(), actualStart)) : undefined;  
  
      return {  
        id: d.id,  
        name: d.name,  
        status: d.status,  
        offset: startOffset,  
        duration: plannedDuration,  
        aOffset: actualStartOffset,  
        aDuration: actualDuration,  
      };  
    });  
  
    return { chartData: cd, minTime, maxTime };  
  }, [data]);  
  
  const xTickFormatter = (h: number) => {  
    const t = new Date(minTime.getTime() + h * 3600000);  
    return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;  
  };  
  
  const color = (status: ProcessItem["status"]) =>  
    status === "blocked" ? "#e11d48" : status === "delayed" ? "#f59e0b" : status === "completed" ? "#64748b" : "#10b981";  
  
  const now = new Date();  
  
  return (  
    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">  
      <div className="text-lg font-semibold mb-2">ガントチャート（簡易）</div>  
      <div className="h-80">  
        <ResponsiveContainer width="100%" height="100%">  
          <BarChart  
            data={chartData}  
            layout="vertical"  
            margin={{ left: 80, right: 16, top: 8, bottom: 8 }}  
            barCategoryGap={10}  
            stackOffset="sign"  
          >  
            <XAxis  
              type="number"  
              domain={[0, (maxTime.getTime() - minTime.getTime()) / 3600000]}  
              tickFormatter={xTickFormatter}  
              fontSize={12}  
            />  
            <YAxis dataKey="id" type="category" fontSize={12} width={70} />  
            <Tooltip  
              contentStyle={{ fontSize: 12 }}  
              formatter={(value: any, key: any, props: any) => {  
                if (key === "duration") return [`${value.toFixed(2)}h`, "計画"];  
                if (key === "aDuration") return [`${value.toFixed(2)}h`, "実績"];  
                return [value, key];  
              }}  
              labelFormatter={(label: any) => {  
                const row = chartData.find((r) => r.id === label);  
                return `${label} ${row?.name ?? ""}`;  
              }}  
            />  
            {/* 計画バー（透明オフセット + 色つきDuration） */}  
            <Bar dataKey="offset" stackId="plan" fill="transparent" isAnimationActive={false} />  
            <Bar dataKey="duration" stackId="plan" radius={[4, 4, 4, 4]}>  
              {chartData.map((entry, i) => (  
                <Cell key={i} fill={`${color(entry.status)}80`} />  
              ))}  
            </Bar>  
            {/* 実績バー（透明オフセット + 色つきDuration） */}  
            <Bar dataKey="aOffset" stackId="act" fill="transparent" isAnimationActive={false} />  
            <Bar dataKey="aDuration" stackId="act" radius={[4, 4, 4, 4]}>  
              {chartData.map((entry, i) => (  
                <Cell key={i} fill={color(entry.status)} />  
              ))}  
            </Bar>  
  
            {/* 現在時刻の縦線 */}  
            <ReferenceLine  
              x={(now.getTime() - minTime.getTime()) / 3600000}  
              stroke="#2563eb"  
              strokeDasharray="3 3"  
              label={{ value: "Now", position: "top", fill: "#2563eb", fontSize: 12 }}  
            />  
          </BarChart>  
        </ResponsiveContainer>  
      </div>  
      <div className="text-xs opacity-70 mt-2">  
        薄色=計画、濃色=実績（進行中は現在時刻まで）。色は状態に応じて変化。  
      </div>  
    </div>  
  );  
};  
  
export default GanttChart;  
