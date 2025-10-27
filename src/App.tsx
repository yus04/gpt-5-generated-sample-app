import React, { useMemo, useState } from "react";  
import ProcessTable from "./components/ProcessTable";  
import ProgressChart from "./components/ProgressChart";  
import GanttChart from "./components/GanttChart";  
import AlertList from "./components/Alert";  
import { useRealtimeData } from "./hooks/useRealtimeData";  
import { ProcessItem } from "./types";  
  
function useDarkMode() {  
  const [dark, setDark] = useState(() => {  
    const v = localStorage.getItem("theme");  
    return v ? v === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)").matches;  
  });  
  React.useEffect(() => {  
    document.documentElement.classList.toggle("dark", dark);  
    localStorage.setItem("theme", dark ? "dark" : "light");  
  }, [dark]);  
  return { dark, setDark };  
}  
  
const KPI: React.FC<{ title: string; value: string; trend?: string; accent?: string }> = ({  
  title,  
  value,  
  trend,  
  accent = "bg-emerald-500",  
}) => {  
  return (  
    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">  
      <div className="text-xs opacity-60">{title}</div>  
      <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>  
      {trend && <div className="text-xs mt-1 opacity-70">{trend}</div>}  
      <div className={`mt-3 h-1 w-12 rounded ${accent}`} aria-hidden="true" />  
    </div>  
  );  
};  
  
const App: React.FC = () => {  
  const [auto, setAuto] = useState(true);  
  const { dark, setDark } = useDarkMode();  
  const { processes, alerts, reload } = useRealtimeData(auto);  
  const [selected, setSelected] = useState<ProcessItem | null>(null);  
  
  const kpis = useMemo(() => {  
    const total = processes.length;  
    const completed = processes.filter((p) => p.status === "completed").length;  
    const delayed = processes.filter((p) => p.status === "delayed").length;  
    const blocked = processes.filter((p) => p.status === "blocked").length;  
    const avgProgress =  
      total > 0 ? Math.round(processes.reduce((a, b) => a + b.progress, 0) / total) : 0;  
    return { total, completed, delayed, blocked, avgProgress };  
  }, [processes]);  
  
  return (  
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">  
      <header className="border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur sticky top-0 z-10">  
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">  
          <div className="flex items-center gap-3">  
            <div className="w-8 h-8 rounded bg-indigo-600" aria-hidden="true" />  
            <div className="text-xl font-semibold">工程進捗ダッシュボード</div>  
          </div>  
          <div className="flex items-center gap-3">  
            <label className="text-sm inline-flex items-center gap-2">  
              <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />  
              自動更新  
            </label>  
            <button  
              className="text-sm px-3 py-1 rounded border hover:bg-slate-50 dark:hover:bg-slate-800"  
              onClick={() => reload()}  
              aria-label="手動更新"  
            >  
              更新  
            </button>  
            <button  
              aria-label="テーマ切替"  
              className="text-sm px-3 py-1 rounded border hover:bg-slate-50 dark:hover:bg-slate-800"  
              onClick={() => setDark((d) => !d)}  
            >  
              {dark ? "ライト" : "ダーク"}  
            </button>  
          </div>  
        </div>  
      </header>  
  
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">  
        {/* KPI */}  
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">  
          <KPI title="工程数" value={`${kpis.total}`} />  
          <KPI title="平均進捗" value={`${kpis.avgProgress}%`} accent="bg-sky-500" />  
          <KPI title="遅延" value={`${kpis.delayed}`} accent="bg-amber-500" />  
          <KPI title="停止" value={`${kpis.blocked}`} accent="bg-rose-600" />  
        </section>  
  
        {/* アラート */}  
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">  
          <div className="lg:col-span-2">  
            <ProcessTable data={processes} onSelect={setSelected} />  
          </div>  
          <div className="lg:col-span-1">  
            <div className="border rounded-xl p-4 bg-white dark:bg-slate-900">  
              <div className="flex items-center justify-between mb-2">  
                <div className="text-lg font-semibold">アラート</div>  
              </div>  
              <AlertList items={alerts} />  
            </div>  
          </div>  
        </section>  
  
        {/* グラフ */}  
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">  
          <ProgressChart data={processes} />  
          <GanttChart data={processes} />  
        </section>  
  
        {/* 詳細パネル */}  
        {selected && (  
          <section className="border rounded-xl p-4 bg-white dark:bg-slate-900">  
            <div className="flex items-start justify-between">  
              <div>  
                <div className="text-lg font-semibold">{selected.name}</div>  
                <div className="text-sm opacity-70">ID: {selected.id}</div>  
              </div>  
              <button  
                className="text-sm px-3 py-1 rounded border hover:bg-slate-50 dark:hover:bg-slate-800"  
                onClick={() => setSelected(null)}  
                aria-label="詳細を閉じる"  
              >  
                閉じる  
              </button>  
            </div>  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">  
              <div>  
                <div className="text-sm opacity-70">ライン/ステーション</div>  
                <div className="font-medium">ライン {selected.line} / {selected.station}</div>  
              </div>  
              <div>  
                <div className="text-sm opacity-70">担当</div>  
                <div className="font-medium">{selected.operator ?? "-"}</div>  
              </div>  
              <div>  
                <div className="text-sm opacity-70">予定</div>  
                <div className="font-medium">  
                  {new Date(selected.plannedStart).toLocaleString()} → {new Date(selected.plannedEnd).toLocaleString()}  
                </div>  
              </div>  
              <div>  
                <div className="text-sm opacity-70">実績</div>  
                <div className="font-medium">  
                  {selected.actualStart ? new Date(selected.actualStart).toLocaleString() : "-"} →{" "}  
                  {selected.actualEnd ? new Date(selected.actualEnd).toLocaleString() : "-"}  
                </div>  
              </div>  
              <div className="sm:col-span-2">  
                <div className="text-sm opacity-70">課題</div>  
                <div className="font-medium">{selected.issues?.join(" / ") || "-"}</div>  
              </div>  
            </div>  
          </section>  
        )}  
      </main>  
  
      <footer className="text-xs opacity-60 text-center py-6">  
        © 2025 Manufacturing Dashboard  
      </footer>  
    </div>  
  );  
};  
  
export default App;  