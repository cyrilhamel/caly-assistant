const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, screen, nativeImage } = require('electron');
const os = require('os');
const path = require('path');
const store = require('./lib/store');
const tracker = require('./lib/tracker');
const server = require('./lib/server');

let overlay, dashboard, focus, tray, trk;

if (!app.requestSingleInstanceLock()) app.quit();

const page = (name) => path.join(__dirname, 'renderer', name);
const webPrefs = { preload: path.join(__dirname, 'preload.js'), contextIsolation: true };

function broadcast() {
  for (const w of [overlay, dashboard, focus]) {
    if (w && !w.isDestroyed()) w.webContents.send('update');
  }
}

function lanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address);
}

function createOverlay() {
  const { workArea } = screen.getPrimaryDisplay();
  overlay = new BrowserWindow({
    width: 320,
    height: 280,
    x: workArea.x + workArea.width - 340,
    y: workArea.y + 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: webPrefs,
  });
  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.loadFile(page('overlay.html'));
  if (!store.settings().overlayVisible) overlay.hide();
}

function openDashboard() {
  if (dashboard && !dashboard.isDestroyed()) return dashboard.show();
  dashboard = new BrowserWindow({ width: 900, height: 700, title: 'Caly Desktop', webPreferences: webPrefs });
  dashboard.setMenuBarVisibility(false);
  dashboard.loadFile(page('dashboard.html'));
}

// Écran plein écran "objectifs" : au démarrage ou lors d'une distraction en mode blocage
function openFocus(reason) {
  if (focus && !focus.isDestroyed()) return focus.show();
  focus = new BrowserWindow({
    fullscreen: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: webPrefs,
  });
  focus.setAlwaysOnTop(true, 'screen-saver');
  focus.loadFile(page('focus.html'), { query: { reason: reason || '' } });
}

function toggleOverlay() {
  const visible = !overlay.isVisible();
  visible ? overlay.show() : overlay.hide();
  store.updateSettings({ overlayVisible: visible });
}

function onDistraction(info) {
  const top = store.goals()[0];
  new Notification({
    title: 'Retour à tes objectifs',
    body: top ? `Priorité : ${top.title}` : `Tu es sur ${info.process}`,
  }).show();
  if (overlay && !overlay.isDestroyed()) {
    overlay.showInactive();
    overlay.webContents.send('update');
  }
  if (store.settings().blockMode) openFocus(`Distraction détectée : ${info.process}`);
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, '..', 'assets', 'icon.png')).resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.setToolTip('Caly Desktop');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Ouvrir le tableau de bord', click: openDashboard },
      { label: "Afficher / masquer l'overlay", click: toggleOverlay },
      { label: 'Écran objectifs', click: () => openFocus('') },
      { type: 'separator' },
      { label: 'Quitter', click: () => app.quit() },
    ])
  );
  tray.on('click', openDashboard);
}

app.whenReady().then(() => {
  store.init();
  app.setLoginItemSettings({ openAtLogin: true });

  ipcMain.handle('state', () => ({
    goals: store.goals(),
    usage: store.get().usage[store.today()] || {},
    settings: store.settings(),
    addresses: lanAddresses(),
    current: trk && trk.current(),
  }));
  ipcMain.handle('complete', (_e, id) => {
    store.completeTask(id);
    broadcast();
  });
  ipcMain.handle('settings', (_e, patch) => {
    store.updateSettings(patch);
    broadcast();
  });
  ipcMain.handle('open-dashboard', openDashboard);
  ipcMain.handle('close-focus', () => focus && !focus.isDestroyed() && focus.close());

  server.start(broadcast);
  trk = tracker.start(onDistraction);
  createOverlay();
  createTray();
  if (store.settings().showFocusAtStartup) openFocus('');
  setInterval(broadcast, 15000);
});

// L'application reste active dans la zone de notification
app.on('window-all-closed', () => {});
app.on('before-quit', () => trk && trk.stop());
