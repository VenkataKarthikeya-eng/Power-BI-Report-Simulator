import http from 'http';

const port = process.env.PORT || 8085;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'UP', service: 'notification-service', version: '1.0.0' }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port, () => {
  console.log(`🔔 Dashboard Capsule AI — Notification Service listening on port ${port}...`);
});
