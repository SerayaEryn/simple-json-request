'use strict';

const t = require('tap');
const test = t.test;
const http = require('http');
const jsonRequest = require('..');

test('Should handle get request', t => {
  t.plan(3);

  const server = http.createServer((req, res) => {
    t.strictEqual(req.url, '/test');
    t.strictEqual(req.method, 'GET');
    res.statusCode = 200;
    res.end('{"data":"hello world"}');
  })

  server.listen(0, () => {
    const port = server.address().port;
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then((data) => {
        t.deepEqual(data, {data: 'hello world'});
        server.close();
      })
      .catch((err) => {
        t.error(err);
        server.close();
      });
  });
});

test('Should reject with 500 error', t => {
  t.plan(5);

  const server = http.createServer((req, res) => {
    t.strictEqual(req.url, '/test');
    res.statusCode = 500;
    res.end('{"data":"hello world"}');
  })

  server.listen(0, () => {
    const port = server.address().port;
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then(() => server.close())
      .catch((err) => {
        t.ok(err);
        t.strictEqual(err.statusCode, 500);
        t.strictEqual(err.message, 'Internal Server Error');
        t.strictEqual(err.code, 'INTERNAL_SERVER_ERROR');
        server.close();
      });
  });
});

test('Should reject with 401 error', t => {
  t.plan(5);

  const server = http.createServer((req, res) => {
    t.strictEqual(req.url, '/test');
    res.statusCode = 401;
    res.end('{"data":"hello world"}');
  })

  server.listen(0, () => {
    const port = server.address().port;
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then(() => server.close())
      .catch((err) => {
        t.ok(err);
        t.strictEqual(err.statusCode, 401);
        t.strictEqual(err.message, 'Unauthorized');
        t.strictEqual(err.code, 'UNAUTHORIZED');
        server.close();
      });
  });
});

test('Should handle post request', t => {
  t.plan(3);

  const server = http.createServer((req, res) => {
    t.strictEqual(req.url, '/test');
    t.strictEqual(req.method, 'POST');
    res.statusCode = 200;
    res.end('{"data":"hello world"}');
  })

  server.listen(0, () => {
    const port = server.address().port;
    jsonRequest.post({
      url: `http://localhost:${port}/test`
    })
      .then((data) => {
        t.deepEqual(data, {data: 'hello world'});
        server.close();
      })
      .catch((err) => {
        t.error(err);
        server.close();
      });
  });
});

test('Should not follow too many redirects', t => {
  t.plan(5);

  const server = http.createServer((req, res) => {
    t.strictEqual(req.url, '/test');
    t.strictEqual(req.method, 'GET');
    res.statusCode = 302;
    res.setHeader('Location', '/test');
    res.end();
  })

  server.listen(0, () => {
    const port = server.address().port;
    jsonRequest.get({
      url: `http://localhost:${port}/test`,
      maxRedirects: 1
    })
      .then((data) => {
        server.close();
      })
      .catch((err) => {
        t.ok(err);
        server.close();
      });
  });
});
