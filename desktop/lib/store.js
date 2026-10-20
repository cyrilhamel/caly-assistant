const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app } = require('electron');

const DEFAULT_SETTINGS = {
  distractions: ['youtube', 'netflix', 'facebook', 'instagram', 'tiktok', 'twitter', 'reddit', 'twitch', 'steam', 'discord'],
  // Secondes de distraction cumulées (fenêtre glissante d'1 minute) avant rappel
  distractionThreshold: 30,
  blockMode: false,
  showFocusAtStartup: true,
  overlayVisible: true,
  token: '',
  port: 47800,
};

let file;
let data;
let saveTimer;

function init() {
  file = path.join(app.getPath('userData'), 'caly-data.json');
  let loaded = {};
  try {
    loaded = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {}
  data = {
    rev: 0,
    tasks: [],
    usage: {},
    ...loaded,
    settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) },
  };
  if (!data.settings.token) {
    data.settings.token = crypto.randomBytes(8).toString('hex');
    flush();
  }
}

function flush() {
  fs.writeFileSync(file, JSON.stringify(data));
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 500);
}

const today = () => new Date().toISOString().slice(0, 10);

const ORDER = { urgent: 0, 'in-progress': 1, todo: 2 };

function goals() {
  return data.tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => (ORDER[a.status] ?? 3) - (ORDER[b.status] ?? 3));
}

function setTasks(tasks) {
  data.tasks = tasks;
  data.rev += 1;
  save();
  return data.rev;
}

function completeTask(id) {
  const t = data.tasks.find((x) => x.id === id);
  if (!t) return;
  t.status = 'done';
  data.rev += 1;
  save();
}

function addUsage(processName, seconds, distracting) {
  const day = (data.usage[today()] ||= {});
  const entry = (day[processName] ||= { seconds: 0, distracting });
  entry.seconds += seconds;
  entry.distracting = distracting;
  save();
}

function updateSettings(patch) {
  data.settings = { ...data.settings, ...patch };
  save();
}

module.exports = {
  init,
  get: () => data,
  settings: () => data.settings,
  goals,
  setTasks,
  completeTask,
  addUsage,
  updateSettings,
  today,
};
