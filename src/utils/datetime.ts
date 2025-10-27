export const toDate = (iso: string | undefined) =>  
  iso ? new Date(iso) : undefined;  
  
export const diffMinutes = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 60000);  
  
export const clamp = (v: number, min: number, max: number) =>  
  Math.max(min, Math.min(max, v));  
  
export const formatTime = (iso: string) => {  
  const d = new Date(iso);  
  const hh = String(d.getHours()).padStart(2, "0");  
  const mm = String(d.getMinutes()).padStart(2, "0");  
  return `${hh}:${mm}`;  
};  
