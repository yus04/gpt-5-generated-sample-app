import { ProcessItem, ProcessStatus } from "../types";  
import { toDate, diffMinutes } from "./datetime";  
  
/* 遅延・ブロック状態を再計算（APIに依存せずフロントで堅牢に） */  
export function computeStatus(p: ProcessItem, now = new Date()): ProcessStatus {  
  if (p.status === "blocked") return "blocked"; // 明示ブロック優先  
  if (p.progress >= 100 || p.actualEnd) return "completed";  
  
  const plannedEnd = toDate(p.plannedEnd)!;  
  const hasStarted = !!(p.actualStart || p.progress > 0);  
  
  // 予定終了を超えているのに未完了 → 遅延  
  if (now > plannedEnd && p.progress < 100) return "delayed";  
  
  // 開始すべき時間を過ぎても未着手（任意要件）  
  const plannedStart = toDate(p.plannedStart)!;  
  if (now > plannedStart && !hasStarted) return "delayed";  
  
  return "on_track";  
}  
  
/* 遅延分（分） */  
export function computeDelayMinutes(p: ProcessItem, now = new Date()): number {  
  const plannedEnd = toDate(p.plannedEnd)!;  
  const actualEnd = toDate(p.actualEnd);  
  const endRef = actualEnd ?? now;  
  if (endRef <= plannedEnd) return 0;  
  return diffMinutes(endRef, plannedEnd);  
}  
  
export function statusColor(status: ProcessStatus) {  
  switch (status) {  
    case "on_track":  
      return "bg-emerald-500 text-white";  
    case "delayed":  
      return "bg-amber-500 text-white";  
    case "blocked":  
      return "bg-rose-600 text-white";  
    case "completed":  
      return "bg-slate-500 text-white";  
  }  
}  
  
export function statusDot(status: ProcessStatus) {  
  switch (status) {  
    case "on_track":  
      return "bg-emerald-500";  
    case "delayed":  
      return "bg-amber-500";  
    case "blocked":  
      return "bg-rose-600";  
    case "completed":  
      return "bg-slate-400";  
  }  
}  
