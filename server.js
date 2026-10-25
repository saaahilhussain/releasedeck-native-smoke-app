'use strict';

const { existsSync } = require('node:fs');
const http = require('node:http');

const HOST = '127.0.0.1';
const PORT = 4100;
const SHUTDOWN_TIMEOUT_MS = 5_000;

function loadEnvironment() {
  if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  if ((process.env.HOST ?? HOST) !== HOST || Number(process.env.PORT ?? PORT) !== PORT) {
    throw new Error(`HOST and PORT must remain ${HOST}:${PORT}`);
  }
}

function createServer() {
  return http.createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      response.end('{"status":"ok"}\n');
      return;
    }

    response.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
    response.end('{"error":"not_found"}\n');
  });
}

function run() {
  loadEnvironment();
  const server = createServer();
  let shuttingDown = false;

  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;

    const timeout = setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS);
    timeout.unref();
    server.close((error) => {
      clearTimeout(timeout);
      process.exit(error ? 1 : 0);
    });
  };

  process.once('SIGTERM', shutdown);
  server.listen(PORT, HOST);
}

if (require.main === module) {
  run();
}

module.exports = { HOST, PORT, createServer, loadEnvironment };
