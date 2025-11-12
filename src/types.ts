export type ProcessStatus = "on_track" | "delayed" | "blocked" | "completed";  
  
export type ProcessItem = {  
  id: string;  
  name: string;  
  line: string;         // 製造ライン  
  station: string;      // 工程名/設備名  
  operator?: string;  
  plannedStart: string; // ISO  
  plannedEnd: string;   // ISO  
  actualStart?: string; // ISO  
  actualEnd?: string;   // ISO  
  progress: number;     // 0-100  
  status: ProcessStatus;  
  issues?: string[];  
};  
  
export type AlertSeverity = "info" | "warning" | "error";  
  
export type AlertItem = {  
  id: string;  
  title: string;  
  message?: string;  
  severity: AlertSeverity;  
  processId?: string;  
  createdAt: string; // ISO  
};  
