const { spawn } = require('child_process');
const path = require('path');
const store = require('./store');

const INTERVAL_S = 5;

function start(onDistraction) {
  const script = path.join(__dirname, '..', 'scripts', 'active-window.ps1');
  const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script], {
    windowsHide: true,
  });

  let buffer = '';
  let samples = []; // secondes de distraction par échantillon sur la dernière minute
  let current = null;

  ps.stdout.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    for (const line of lines) {
      try {
        handle(JSON.parse(line));
      } catch {}
    }
  });

  function isDistracting(info) {
    const hay = `${info.process} ${info.title}`.toLowerCase();
    return store.settings().distractions.some((k) => k && hay.includes(k.toLowerCase()));
  }

  function handle(info) {
    if (!info.process) return;
    const distracting = isDistracting(info);
    current = { ...info, distracting };
    store.addUsage(info.process, INTERVAL_S, distracting);

    samples.push(distracting ? INTERVAL_S : 0);
    if (samples.length > 60 / INTERVAL_S) samples.shift();
    const distracted = samples.reduce((a, b) => a + b, 0);
    if (distracting && distracted >= store.settings().distractionThreshold) {
      samples = [];
      onDistraction(current);
    }
  }

  return {
    current: () => current,
    stop: () => ps.kill(),
  };
}

module.exports = { start };
