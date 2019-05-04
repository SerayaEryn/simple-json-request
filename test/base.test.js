'use strict'

const test = require('ava')
const http = require('http')
const jsonRequest = require('..')

test.cb('Should handle get request', t => {
  t.plan(3)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'GET')
    res.statusCode = 200
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then((data) => {
        t.deepEqual(data, { data: 'hello world' })
        t.end()
        server.close()
      })
      .catch((err) => {
        t.falsy(err)
        server.close()
      })
  })
})

test.cb('Should handle get request with headers', t => {
  t.plan(3)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'GET')
    res.statusCode = 200
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`,
      headers: {
        header: 'value'
      }
    })
      .then((data) => {
        t.deepEqual(data, { data: 'hello world' })
        t.end()
        server.close()
      })
      .catch((err) => {
        t.falsy(err)
        server.close()
      })
  })
})

test.cb('Should use custom json parser', t => {
  t.plan(3)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'GET')
    res.statusCode = 200
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`,
      parser: () => {
        return { hello: 'world' }
      }
    })
      .then((data) => {
        t.deepEqual(data, { hello: 'world' })
        t.end()
        server.close()
      })
      .catch((err) => {
        t.falsy(err)
        server.close()
      })
  })
})

test.cb('Should set accept header', t => {
  t.plan(1)

  const server = http.createServer((req, res) => {
    t.is(req.headers.accept, 'application/json')
    res.statusCode = 200
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then((data) => {
        t.end()
        server.close()
      })
      .catch((err) => {
        t.falsy(err)
        server.close()
      })
  })
})

test.cb('Should set read timeout', t => {
  t.plan(2)

  const server = http.createServer((req, res) => {
    setTimeout(() => {
      res.statusCode = 200
      res.end('{"data":"hello world"}')
    }, 250)
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`,
      readTimeout: 100
    })
      .then((data) => {
        server.close()
      })
      .catch((err) => {
        t.truthy(err)
        t.is(err.code, 'ERR_READ_TIMEOUT')
        t.end()
        server.close()
      })
  })
})

test.cb('Should reject with 500 error', t => {
  t.plan(5)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    res.statusCode = 500
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then(() => server.close())
      .catch((err) => {
        t.truthy(err)
        t.is(err.statusCode, 500)
        t.is(err.message, 'Internal Server Error')
        t.is(err.code, 'INTERNAL_SERVER_ERROR')
        t.end()
        server.close()
      })
  })
})

test.cb('Should reject with 401 error', t => {
  t.plan(5)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    res.statusCode = 401
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then(() => server.close())
      .catch((err) => {
        t.truthy(err)
        t.is(err.statusCode, 401)
        t.is(err.message, 'Unauthorized')
        t.is(err.code, 'UNAUTHORIZED')
        t.end()
        server.close()
      })
  })
})

test.cb('Should pass data with error', t => {
  t.plan(6)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    res.statusCode = 500
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .then(() => server.close())
      .catch((err) => {
        t.truthy(err)
        t.is(err.statusCode, 500)
        t.is(err.message, 'Internal Server Error')
        t.is(err.code, 'INTERNAL_SERVER_ERROR')
        t.is(err.data.toString(), '{"data":"hello world"}')
        t.end()
        server.close()
      })
  })
})

test.cb('Should handle post request', t => {
  t.plan(3)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'POST')
    res.statusCode = 200
    res.end('{"data":"hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.post({
      url: `http://localhost:${port}/test`
    })
      .then((data) => {
        t.deepEqual(data, { data: 'hello world' })
        t.end()
        server.close()
      })
      .catch((err) => {
        t.falsy(err)
        server.close()
      })
  })
})

test.cb('Should not follow too many redirects', t => {
  t.plan(5)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'GET')
    res.statusCode = 302
    res.setHeader('Location', '/test')
    res.end()
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`,
      maxRedirects: 1
    })
      .then((data) => {
        server.close()
      })
      .catch((err) => {
        t.truthy(err)
        t.end()
        server.close()
      })
  })
})

test.cb('Should handle parse errors correctly', t => {
  t.plan(3)

  const server = http.createServer((req, res) => {
    t.is(req.url, '/test')
    t.is(req.method, 'GET')
    res.statusCode = 200
    res.end('{data":hello world"}')
  })

  server.listen(0, () => {
    const port = server.address().port
    jsonRequest.get({
      url: `http://localhost:${port}/test`
    })
      .catch((err) => {
        t.truthy(err)
        t.end()
        server.close()
      })
  })
})
