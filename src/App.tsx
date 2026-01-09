import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Store } from "@tauri-apps/plugin-store";
import { Settings, RefreshCw, Moon, Sun } from "lucide-react";
import { Task } from "./types";
import { TaskCard } from "./components/TaskCard";
import { SettingsPage } from "./components/Settings";
import { clsx } from "clsx";

function App() {
  const [view, setView] = useState<"tasks" | "settings">("tasks");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isConfigured, setIsConfigured] = useState(false);
  const [credentials, setCredentials] = useState<{ token: string; dbId: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const store = await Store.load('settings.json');
      const token = await store.get<string>('notion_token');
      const taskDbId = await store.get<string>('tasks_db_id');
      const themePref = await store.get<string>('theme');

      if (themePref) {
        setTheme(themePref as "light" | "dark");
        if (themePref === "dark") document.documentElement.classList.add("dark");
      } else {
        // Default to dark mode for premium feel
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }

      if (token && taskDbId) {
        setCredentials({ token, dbId: taskDbId });
        setIsConfigured(true);
        fetchTasks(token, taskDbId);
      } else {
        setView("settings");
      }
    };
    init();
  }, []);

  const fetchTasks = async (token: string, dbId: string) => {
    setLoading(true);
    try {
      const res = await invoke<Task[]>("fetch_tasks", { token, databaseId: dbId });
      console.log("Fetched tasks from Notion:", res);
      setTasks(res);
    } catch (e) {
      console.error("Fetch failed", e);
      alert(`Failed to fetch tasks: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    const store = await Store.load('settings.json');
    await store.set('theme', newTheme);
    await store.save();
  };

  if (view === "settings") {
    return <SettingsPage onSave={() => window.location.reload()} />;
  }

  // Sort tasks: Urgent (Do Date closest/passed) first? Or by creation?
  // Use simplistic sorting for now.
  const sortedTasks = [...tasks]; 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500/30 transition-colors duration-300">
      
      {/* Header - Minimalist & Glassy */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
            {/* Subtle branding or just empty space for cleaner look */}
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 dark:text-slate-400"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => credentials && fetchTasks(credentials.token, credentials.dbId)}
            className={clsx(
              "p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 dark:text-slate-400",
              loading && "animate-spin"
            )}
            title="Refresh Tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setView("settings")}
            className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 dark:text-slate-400"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto flex flex-col gap-4">
        
        {!isConfigured ? (
           <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
             <p>Configure Notion access in settings.</p>
           </div>
        ) : tasks.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
             <div className="text-4xl">✨</div>
             <p className="text-sm font-medium">All tasks clear for today</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
             {sortedTasks.map((task, idx) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={idx}
                  notionToken={credentials?.token || ''}
                  onComplete={() => {}}
                />
             ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
