const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('caly', {
  getState: () => ipcRenderer.invoke('state'),
  completeTask: (id) => ipcRenderer.invoke('complete', id),
  updateSettings: (patch) => ipcRenderer.invoke('settings', patch),
  openDashboard: () => ipcRenderer.invoke('open-dashboard'),
  closeFocus: () => ipcRenderer.invoke('close-focus'),
  onUpdate: (cb) => ipcRenderer.on('update', () => cb()),
});
