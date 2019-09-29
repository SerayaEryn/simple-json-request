'use strict'

const simpleGet = require('simple-get')
const HttpError = require('./HttpError')
const JsonParseError = require('./JsonParseError')
const ReadTimeoutError = require('./ReadTimeoutError')

function request (options) {
  if (typeof options === 'string') {
    options = { url: options, method: 'GET' }
  }
  if (!options.headers) {
    options.headers = {}
  }
  options.headers.accept = 'application/json'
  return new Promise((resolve, reject) => {
    let hasReadTimeout = false
    let timeout
    const req = simpleGet.concat(options, (error, response, data) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      if (hasReadTimeout) {
        reject(new ReadTimeoutError())
      } else if (error) {
        reject(error)
      } else if (response.statusCode >= 400) {
        reject(new HttpError(response.statusCode, data))
      } else {
        parse(options, data, resolve, reject)
      }
    })
    if (options.readTimeout) {
      timeout = setTimeout(() => {
        hasReadTimeout = true
        req.abort()
      }, options.readTimeout)
    }
  })
}

function get (options) {
  return requestWithMethod(options, 'GET')
}

function post (options) {
  return requestWithMethod(options, 'POST')
}

function put (options) {
  return requestWithMethod(options, 'PUT')
}

function del (options) {
  return requestWithMethod(options, 'DELETE')
}

function head (options) {
  return requestWithMethod(options, 'HEAD')
}

function patch (options) {
  return requestWithMethod(options, 'PATCH')
}

function requestWithMethod (options, method) {
  if (typeof options === 'string') {
    options = { url: options }
  }
  options.method = method
  return request(options)
}

function parse (options, data, resolve, reject) {
  if (options.method === 'HEAD') {
    return resolve(null)
  }
  try {
    const parser = options.parser || JSON.parse
    const parsedData = parser(data)
    resolve(parsedData)
  } catch (error) {
    reject(new JsonParseError(data))
  }
}

module.exports = {
  request,
  get,
  post,
  delete: del,
  put,
  head,
  patch
}
