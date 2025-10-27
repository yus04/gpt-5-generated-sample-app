import { ProcessItem, AlertItem } from "../types";  
  
/* 擬似データ生成 */  
let base: ProcessItem[] = [  
  {  
    id: "P-1001",  
    name: "フレーム組立",  
    line: "A",  
    station: "STA-01",  
    operator: "田中",  
    plannedStart: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h前  
    plannedEnd: new Date(Date.now() + 60 * 60 * 1000).toISOString(),   // 1h後  
    actualStart: new Date(Date.now() - 50 * 60 * 1000).toISOString(),  
    progress: 45,  
    status: "on_track",  
  },  
  {  
    id: "P-1002",  
    name: "溶接",  
    line: "A",  
    station: "STA-02",  
    operator: "佐藤",  
    plannedStart: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),  
    plannedEnd: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分前終了予定  
    actualStart: new Date(Date.now() - 110 * 60 * 1000).toISOString(),  
    progress: 80,  
    status: "delayed",  
    issues: ["治具調整待ち"],  
  },  
  {  
    id: "P-1003",  
    name: "塗装",  
    line: "B",  
    station: "STA-05",  
    operator: "鈴木",  
    plannedStart: new Date(Date.now() + 10 * 60 * 1000).toISOString(),  
    plannedEnd: new Date(Date.now() + 90 * 60 * 1000).toISOString(),  
    progress: 0,  
    status: "on_track",  
  },  
  {  
    id: "P-1004",  
    name: "検査",  
    line: "B",  
    station: "STA-06",  
    operator: "高橋",  
    plannedStart: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),  
    plannedEnd: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),  
    actualStart: new Date(Date.now() - 170 * 60 * 1000).toISOString(),  
    actualEnd: new Date(Date.now() - 20 * 60 * 1000).toISOString(),  
    progress: 100,  
    status: "completed",  
  },  
  {  
    id: "P-1005",  
    name: "組付け",  
    line: "C",  
    station: "STA-10",  
    operator: "伊藤",  
    plannedStart: new Date(Date.now() - 30 * 60 * 1000).toISOString(),  
    plannedEnd: new Date(Date.now() + 120 * 60 * 1000).toISOString(),  
    progress: 10,  
    status: "blocked",  
    issues: ["部品欠品（ABC-123）"],  
  },  
];  
  
let alerts: AlertItem[] = [  
  {  
    id: "AL-1",  
    title: "工程遅延 発生",  
    message: "溶接（P-1002）が予定を超過しています",  
    severity: "warning",  
    processId: "P-1002",  
    createdAt: new Date().toISOString(),  
  },  
  {  
    id: "AL-2",  
    title: "ブロック状態",  
    message: "組付け（P-1005）で部品欠品",  
    severity: "error",  
    processId: "P-1005",  
    createdAt: new Date().toISOString(),  
  },  
];  
  
/* 擬似API */  
export async function fetchProcesses(): Promise<ProcessItem[]> {  
  await new Promise((r) => setTimeout(r, 200));  
  return JSON.parse(JSON.stringify(base));  
}  
  
export async function fetchAlerts(): Promise<AlertItem[]> {  
  await new Promise((r) => setTimeout(r, 100));  
  return JSON.parse(JSON.stringify(alerts));  
}  
  
/* 疑似リアルタイム更新: 進捗を少し進めたり、遅延を発生させる */  
export function simulateTick() {  
  base = base.map((p) => {  
    const next = { ...p };  
    if (next.status !== "completed" && next.status !== "blocked") {  
      // 進捗をランダムで増やす  
      const delta = Math.random() < 0.7 ? Math.random() * 2 : 0;  
      next.progress = Math.min(100, next.progress + delta);  
      if (next.progress >= 100 && !next.actualEnd) {  
        next.actualEnd = new Date().toISOString();  
        next.status = "completed";  
      }  
    }  
    // たまにブロックを解除  
    if (next.status === "blocked" && Math.random() < 0.05) {  
      next.status = "on_track";  
      next.issues = [];  
    }  
    return next;  
  });  
  
  // ランダムで新しい遅延アラートを追加（サンプル）  
  if (Math.random() < 0.1) {  
    const delayed = base.find((p) => p.status === "delayed");  
    if (delayed) {  
      alerts.unshift({  
        id: `AL-${Math.floor(Math.random() * 10000)}`,  
        title: "遅延継続",  
        message: `${delayed.name}（${delayed.id}）の遅延が継続しています`,  
        severity: "warning",  
        processId: delayed.id,  
        createdAt: new Date().toISOString(),  
      });  
      alerts = alerts.slice(0, 10);  
    }  
  }  
}  
