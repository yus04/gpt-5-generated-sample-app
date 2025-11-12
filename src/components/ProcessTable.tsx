import React, { useMemo, useState } from "react";  
import { ProcessItem } from "../types";  
import { computeDelayMinutes, statusColor, statusDot } from "../utils/status";  
import { formatTime } from "../utils/datetime";  
  
type Props = {  
  data: ProcessItem[];  
  onSelect?: (p: ProcessItem) => void;  
};  
  
const ProgressBar: React.FC<{ value: number; status: ProcessItem["status"] }> = ({ value, status }) => {  
  const bg =  
    status === "blocked" ? "bg-rose-500" : status === "delayed" ? "bg-amber-500" : "bg-emerald-500";  
  return (  
    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded">  
      <div  
        className={`${bg} h-2 rounded transition-all`}  
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}  
        aria-valuenow={Math.round(value)}  
        aria-valuemin={0}  
        aria-valuemax={100}  
        role="progressbar"  
      />  
    </div>  
  );  
};  
  
const StatusPill: React.FC<{ status: ProcessItem["status"] }> = ({ status }) => {  
  return (  
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusColor(status)}`}>  
      <span className={`w-2 h-2 rounded-full ${statusDot(status)}`} />  
      {status === "on_track" && "順調"}  
      {status === "delayed" && "遅延"}  
      {status === "blocked" && "停止"}  
      {status === "completed" && "完了"}  
    </span>  
  );  
};  
  
const ProcessTable: React.FC<Props> = ({ data, onSelect }) => {  
  const [query, setQuery] = useState("");  
  const [line, setLine] = useState<string>("all");  
  const [onlyAlerts, setOnlyAlerts] = useState(false);  
  
  const lines = useMemo(() => {  
    return Array.from(new Set(data.map((d) => d.line)));  
  }, [data]);  
  
  const filtered = useMemo(() => {  
    return data  
      .filter((d) => (line === "all" ? true : d.line === line))  
      .filter((d) => (onlyAlerts ? d.status === "delayed" || d.status === "blocked" : true))  
      .filter(  
        (d) =>  
          d.id.toLowerCase().includes(query.toLowerCase()) ||  
          d.name.includes(query) ||  
          d.station.toLowerCase().includes(query.toLowerCase())  
      )  
      .sort((a, b) => {  
        const order = ["blocked", "delayed", "on_track", "completed"];  
        return order.indexOf(a.status) - order.indexOf(b.status);  
      });  
  }, [data, line, onlyAlerts, query]);  
  
  return (  
    <div className="border rounded-xl overflow-hidden bg-white dark:bg-slate-900">  
      <div className="p-4 border-b flex flex-col md:flex-row gap-2 md:items-center md:justify-between">  
        <div className="text-lg font-semibold">工程一覧</div>  
        <div className="flex gap-2 items-center">  
          <input  
            aria-label="検索"  
            value={query}  
            onChange={(e) => setQuery(e.target.value)}  
            placeholder="ID/名称/工程で検索"  
            className="border rounded px-3 py-1 text-sm bg-white dark:bg-slate-800"  
          />  
          <select  
            aria-label="ライン選択"  
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-800"  
            value={line}  
            onChange={(e) => setLine(e.target.value)}  
          >  
            <option value="all">全ライン</option>  
            {lines.map((l) => (  
              <option key={l} value={l}>  
                ライン {l}  
              </option>  
            ))}  
          </select>  
          <label className="inline-flex items-center gap-1 text-sm">  
            <input  
              type="checkbox"  
              checked={onlyAlerts}  
              onChange={(e) => setOnlyAlerts(e.target.checked)}  
            />  
            アラートのみ  
          </label>  
        </div>  
      </div>  
      <div className="overflow-auto">  
        <table className="min-w-[800px] w-full text-sm">  
          <thead className="bg-slate-50 dark:bg-slate-800">  
            <tr className="text-left">  
              <th className="px-3 py-2">ID</th>  
              <th className="px-3 py-2">工程</th>  
              <th className="px-3 py-2">ライン/ステーション</th>  
              <th className="px-3 py-2">担当</th>  
              <th className="px-3 py-2">予定</th>  
              <th className="px-3 py-2">進捗</th>  
              <th className="px-3 py-2">状態</th>  
              <th className="px-3 py-2">遅延</th>  
              <th className="px-3 py-2"></th>  
            </tr>  
          </thead>  
          <tbody>  
            {filtered.map((p) => {  
              const delay = computeDelayMinutes(p);  
              return (  
                <tr  
                  key={p.id}  
                  className="border-t hover:bg-slate-50/60 dark:hover:bg-slate-800 cursor-pointer"  
                  onClick={() => onSelect?.(p)}  
                >  
                  <td className="px-3 py-2 font-mono">{p.id}</td>  
                  <td className="px-3 py-2">{p.name}</td>  
                  <td className="px-3 py-2">  
                    <div className="flex flex-col">  
                      <span>ライン {p.line}</span>  
                      <span className="text-xs opacity-70">{p.station}</span>  
                    </div>  
                  </td>  
                  <td className="px-3 py-2">{p.operator ?? "-"}</td>  
                  <td className="px-3 py-2">  
                    <div className="flex flex-col">  
                      <span>  
                        {formatTime(p.plannedStart)} → {formatTime(p.plannedEnd)}  
                      </span>  
                      <span className="text-xs opacity-70">  
                        実績: {p.actualStart ? formatTime(p.actualStart) : "-"} →{" "}  
                        {p.actualEnd ? formatTime(p.actualEnd) : "-"}  
                      </span>  
                    </div>  
                  </td>  
                  <td className="px-3 py-2 w-56">  
                    <div className="flex items-center gap-2">  
                      <ProgressBar value={p.progress} status={p.status} />  
                      <span className="w-10 text-right tabular-nums">{Math.round(p.progress)}%</span>  
                    </div>  
                  </td>  
                  <td className="px-3 py-2">  
                    <StatusPill status={p.status} />  
                  </td>  
                  <td className="px-3 py-2 tabular-nums">{delay > 0 ? `${delay}分` : "-"}</td>  
                  <td className="px-3 py-2">  
                    {p.issues?.length ? (  
                      <span className="text-xs text-rose-600 dark:text-rose-400">課題: {p.issues[0]}</span>  
                    ) : (  
                      <span className="text-xs opacity-60">-</span>  
                    )}  
                  </td>  
                </tr>  
              );  
            })}  
            {filtered.length === 0 && (  
              <tr>  
                <td colSpan={9} className="px-3 py-6 text-center opacity-60">  
                  該当データがありません  
                </td>  
              </tr>  
            )}  
          </tbody>  
        </table>  
      </div>  
    </div>  
  );  
};  
  
export default ProcessTable;  
