const http = require('http');
const store = require('./store');

// API de synchronisation avec l'application mobile (réseau local).
// GET  /state            -> { rev, tasks }
// POST /state {tasks}    -> { rev }  (remplace les tâches)
// Authentification : en-tête "x-caly-token".
function start(onChange) {
  const server = http.createServer((req, res) => {
    const send = (code, body) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    };

    if (req.headers['x-caly-token'] !== store.settings().token) return send(401, { error: 'token invalide' });

    if (req.method === 'GET' && req.url.startsWith('/state')) {
      const { rev, tasks } = store.get();
      return send(200, { rev, tasks });
    }

    if (req.method === 'POST' && req.url.startsWith('/state')) {
      let body = '';
      req.on('data', (c) => {
        body += c;
        if (body.length > 5e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const { tasks } = JSON.parse(body);
          if (!Array.isArray(tasks)) return send(400, { error: 'tasks requis' });
          const rev = store.setTasks(tasks);
          onChange();
          send(200, { rev });
        } catch {
          send(400, { error: 'JSON invalide' });
        }
      });
      return;
    }

    send(404, { error: 'introuvable' });
  });

  server.on('error', (e) => console.error('Serveur de synchro :', e.message));
  server.listen(store.settings().port, '0.0.0.0');
  return server;
}

module.exports = { start };
