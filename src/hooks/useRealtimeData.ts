import { useEffect, useRef, useState } from "react";  
import { fetchAlerts, fetchProcesses, simulateTick } from "../data/mockApi";  
import { ProcessItem, AlertItem } from "../types";  
import { computeStatus } from "../utils/status";  
  
/* setIntervalでの擬似Push。autoRefreshがtrueの間だけ動作 */  
export function useRealtimeData(autoRefresh: boolean) {  
  const [processes, setProcesses] = useState<ProcessItem[]>([]);  
  const [alerts, setAlerts] = useState<AlertItem[]>([]);  
  const timerRef = useRef<number | null>(null);  
  
  const load = async () => {  
    const [p, a] = await Promise.all([fetchProcesses(), fetchAlerts()]);  
    const now = new Date();  
    // ステータス再評価  
    setProcesses(  
      p.map((x) => ({  
        ...x,  
        status: computeStatus(x, now),  
      }))  
    );  
    setAlerts(a);  
  };  
  
  useEffect(() => {  
    load();  
  }, []);  
  
  useEffect(() => {  
    if (autoRefresh) {  
      timerRef.current = window.setInterval(() => {  
        simulateTick();  
        load();  
      }, 3000);  
    }  
    return () => {  
      if (timerRef.current) window.clearInterval(timerRef.current);  
    };  
  }, [autoRefresh]);  
  
  return { processes, alerts, reload: load };  
}  
