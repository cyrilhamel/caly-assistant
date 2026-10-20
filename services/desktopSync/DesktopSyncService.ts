import { loadData, saveData } from '@/utils/storage';
import { Task } from '@/types/app';

// Synchronisation avec Caly Desktop (réseau local)
export interface DesktopSyncConfig {
  address: string; // ex: 192.168.1.20:47800
  token: string;
}

const CONFIG_KEY = 'desktopSyncConfig';

export const loadDesktopConfig = () => loadData<DesktopSyncConfig | null>(CONFIG_KEY, null);
export const saveDesktopConfig = (c: DesktopSyncConfig) => saveData(CONFIG_KEY, c);

const request = async (c: DesktopSyncConfig, init?: RequestInit) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(`http://${c.address}/state`, {
      ...init,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-caly-token': c.token },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
};

const reviveTask = (t: any): Task => ({ ...t, dueDate: t.dueDate ? new Date(t.dueDate) : undefined });

export async function pullTasks(c: DesktopSyncConfig): Promise<{ rev: number; tasks: Task[] }> {
  const { rev, tasks } = await request(c);
  return { rev, tasks: tasks.map(reviveTask) };
}

export async function pushTasks(c: DesktopSyncConfig, tasks: Task[]): Promise<number> {
  const { rev } = await request(c, { method: 'POST', body: JSON.stringify({ tasks }) });
  return rev;
}
