'use strict';

const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');
const test = require('node:test');

const { createServer } = require('../server.js');

async function request(server, path) {
  const address = server.address();
  return new Promise((resolve, reject) => {
    const outgoing = http.get(
      { host: '127.0.0.1', port: address.port, path },
      (response) => {
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => resolve({ statusCode: response.statusCode, body }));
      },
    );
    outgoing.on('error', reject);
  });
}

test('GET /health returns a minimal healthy response', async (t) => {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const response = await request(server, '/health');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(response.body), { status: 'ok' });
});

test('unknown routes return 404', async (t) => {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());

  const response = await request(server, '/missing');
  assert.equal(response.statusCode, 404);
});
