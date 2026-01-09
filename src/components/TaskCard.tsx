import { useState, useEffect } from "react";
import { Task } from "../types";
import { invoke } from "@tauri-apps/api/core";
import { clsx } from "clsx";
import { differenceInMilliseconds, differenceInHours, parseISO, format } from "date-fns";

interface TaskCardProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  notionToken: string;
}

export function TaskCard({ task, index, onComplete, notionToken }: TaskCardProps) {
  const [complete, setComplete] = useState(task.status === "Done");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "overdue">("normal");

  useEffect(() => {
    if (complete) return;

    const calcTime = () => {
      if (!task.do_date) return "";
      
      const now = new Date();
      const targetStr = task.do_date.includes("T") ? task.do_date : `${task.do_date}T23:59:59`;
      const target = parseISO(targetStr);
      
      const diffMs = differenceInMilliseconds(target, now);
      const diffHrs = differenceInHours(target, now);

      if (diffMs < 0) {
        setUrgency("overdue");
        return "Overdue";
      }

      if (diffHrs < 3) {
        setUrgency("urgent");
        // HH:MM:SS
        const h = Math.floor(diffMs / 3600000);
        const m = Math.floor((diffMs % 3600000) / 60000);
        const s = Math.floor((diffMs % 60000) / 1000);
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } else {
        setUrgency("normal");
        return `${diffHrs}h`;
      }
    };

    const str = calcTime();
    setTimeRemaining(str);
    
    const interval = setInterval(() => {
       setTimeRemaining(calcTime());
    }, urgency === "urgent" ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [task.do_date, complete, urgency]);


  const handleCheck = async () => {
    const newState = !complete;
    setComplete(newState);
    if (newState) {
        onComplete(task.id);
    }
    
    try {
        await invoke("mark_task_complete", { token: notionToken, pageId: task.id, completed: newState });
    } catch (e) {
        console.error("Failed to sync completion", e);
        setComplete(!newState); // Revert on failure
    }
  };

  // Format deadline for display (e.g. "Today", "Oct 24")
  const displayDate = task.do_date ? format(parseISO(task.do_date), "MMM d") : "";

  return (
    <div 
      className={clsx(
        "w-full py-3 px-3 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800 last:border-0",
        complete ? "opacity-50" : "",
        !complete && urgency === "urgent" ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      )}
    >
      <div className="flex flex-col gap-1">
          {/* Top Row: Number, Title, Countdown */}
          <div className="flex items-center gap-3">
              {/* Checkbox / Number Wrapper */}
              <div className="flex items-center gap-2 min-w-[24px]">
                  <span className="text-slate-400 text-sm font-mono w-4 text-right">{index + 1}.</span>
                  <input 
                    type="checkbox"
                    checked={complete}
                    onChange={handleCheck}
                    className="accent-slate-900 dark:accent-sky-500 cursor-pointer w-4 h-4"
                  />
              </div>

              {/* Title */}
              <div className={clsx("flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 truncate", complete && "line-through decoration-slate-400")}>
                  {task.title}
              </div>

              {/* Countdown / Deadline */}
              <div className="flex items-center gap-4 text-xs font-mono">
                  {displayDate && <span className="text-slate-400 hidden sm:block">{displayDate}</span>}
                  
                  {timeRemaining && !complete && (
                       <span className={clsx(
                          "font-bold w-16 text-right",
                          urgency === "urgent" ? "text-red-500 animate-pulse" : "text-slate-500 dark:text-slate-400"
                       )}>
                          {timeRemaining}
                       </span>
                  )}
              </div>
          </div>
          
          {/* Bottom Row: Objective / Context (Italicized) */}
          {(task.objective_name || task.objective_deadline) && (
              <div className="pl-10 text-xs text-slate-500 dark:text-slate-400 italic">
                  {task.objective_name} 
                  {task.objective_deadline && ` • ${task.objective_deadline}`}
              </div>
          )}
      </div>
    </div>
  );
}
