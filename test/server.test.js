'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const { handleRequest } = require('../server.js');

function request(method, url) {
  const result = { body: '', headers: {}, statusCode: undefined };
  const response = {
    writeHead(statusCode, headers) {
      result.statusCode = statusCode;
      result.headers = { ...headers };
    },
    end(body = '') {
      result.body += body;
    },
  };

  handleRequest({ method, url }, response);
  return result;
}

test('GET /health returns the intentional unhealthy release response', () => {
  const response = request('GET', '/health');
  assert.equal(response.statusCode, 503);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(response.body), { status: 'unhealthy' });
});

test('unknown routes return 404', () => {
  const response = request('GET', '/missing');
  assert.equal(response.statusCode, 404);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(response.body), { error: 'not_found' });
});
