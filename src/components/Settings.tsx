import { useState, useEffect } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SettingsData {
  notionToken: string;
  objectiveDbId: string;
  tasksDbId: string;
}

export function SettingsPage({ onSave }: { readonly onSave: () => void }) {
  const [data, setData] = useState<SettingsData>({
    notionToken: '',
    objectiveDbId: '',
    tasksDbId: '',
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const loadSettings = async () => {
      const store = await Store.load('settings.json');
      const token = await store.get<string>('notion_token');
      const objId = await store.get<string>('objective_db_id');
      const taskId = await store.get<string>('tasks_db_id');
      
      setData({
        notionToken: token || '',
        objectiveDbId: objId || '',
        tasksDbId: taskId || '',
      });
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    // Basic validation
    if (!data.notionToken || !data.objectiveDbId || !data.tasksDbId) {
       alert("All fields are required");
       setStatus('idle');
       return;
    }

    const store = await Store.load('settings.json');
    await store.set('notion_token', data.notionToken);
    await store.set('objective_db_id', data.objectiveDbId);
    await store.set('tasks_db_id', data.tasksDbId);
    await store.save();
    
    setStatus('saved');
    setTimeout(() => {
      setStatus('idle');
      onSave(); // Navigate back
    }, 500);
  };


  return (
    <div className="p-6 flex flex-col gap-6 h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        <Settings className="w-6 h-6 text-sky-500" />
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Notion Integration Token</label>
            <input 
              type="password" 
              value={data.notionToken}
              onChange={e => setData({...data, notionToken: e.target.value})}
              className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="secret_..."
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Objectives Database ID</label>
            <input 
              type="text" 
              value={data.objectiveDbId}
              onChange={e => setData({...data, objectiveDbId: e.target.value})}
              className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="32 character ID"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Tasks Database ID</label>
            <input 
              type="text" 
              value={data.tasksDbId}
              onChange={e => setData({...data, tasksDbId: e.target.value})}
              className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="32 character ID"
            />
        </div>
      </div>

       <div className="mt-auto">
        <button 
          onClick={handleSave}
          disabled={status === 'saving'}
          className={twMerge(
            "w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors",
            "bg-sky-500 hover:bg-sky-600 text-white shadow-sm",
            status === 'saving' && "opacity-70 cursor-wait",
            status === 'saved' && "bg-green-500 hover:bg-green-600"
          )}
        >
          <Save className="w-4 h-4" />
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save & Continue'}
        </button>
      </div>

      <div className="bg-sky-50 dark:bg-slate-800 p-3 rounded-md flex gap-2 items-start text-xs text-slate-500 dark:text-slate-400">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Ensure your Integration is connected to both databases in Notion.</p>
      </div>
    </div>
  );
}
