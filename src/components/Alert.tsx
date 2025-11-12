import React from "react";  
import { AlertItem } from "../types";  
  
type Props = {  
  item: AlertItem;  
  onClose?: (id: string) => void;  
};  
  
export const AlertBadge: React.FC<{ severity: AlertItem["severity"] }> = ({ severity }) => {  
  const color =  
    severity === "error"  
      ? "bg-rose-600"  
      : severity === "warning"  
      ? "bg-amber-500"  
      : "bg-sky-500";  
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} aria-hidden="true" />;  
};  
  
export const AlertCard: React.FC<Props> = ({ item, onClose }) => {  
  const color =  
    item.severity === "error"  
      ? "border-rose-500/40 bg-rose-50 dark:bg-rose-950/30"  
      : item.severity === "warning"  
      ? "border-amber-500/40 bg-amber-50 dark:bg-amber-950/30"  
      : "border-sky-500/40 bg-sky-50 dark:bg-sky-950/30";  
  
  return (  
    <div  
      role="alert"  
      aria-live="polite"  
      className={`border rounded-lg px-3 py-2 flex items-start gap-2 ${color}`}  
    >  
      <AlertBadge severity={item.severity} />  
      <div className="flex-1">  
        <div className="font-medium">{item.title}</div>  
        {item.message && <div className="text-sm opacity-80">{item.message}</div>}  
        <div className="text-xs opacity-60">{new Date(item.createdAt).toLocaleString()}</div>  
      </div>  
      {onClose && (  
        <button  
          aria-label="アラートを閉じる"  
          className="text-sm opacity-60 hover:opacity-100"  
          onClick={() => onClose(item.id)}  
        >  
          ×  
        </button>  
      )}  
    </div>  
  );  
};  
  
type ListProps = {  
  items: AlertItem[];  
  onClose?: (id: string) => void;  
};  
  
const AlertList: React.FC<ListProps> = ({ items, onClose }) => {  
  if (items.length === 0) return <div className="text-sm opacity-60 px-2 py-1">アラートはありません</div>;  
  return (  
    <div className="space-y-2">  
      {items.map((a) => (  
        <AlertCard key={a.id} item={a} onClose={onClose} />  
      ))}  
    </div>  
  );  
};  
  
export default AlertList;  
