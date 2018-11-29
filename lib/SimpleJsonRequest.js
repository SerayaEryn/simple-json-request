'use strict'

const simpleGet = require('simple-get')
const HttpError = require('./HttpError')
const JsonParseError = require('./JsonParseError')
const ReadTimeoutError = require('./ReadTimeoutError')

function request (options) {
  if (!options.headers) {
    options.headers = {}
  }
  options.headers.accept = 'application/json'
  return new Promise((resolve, reject) => {
    let hasReadTimeout = false
    const req = simpleGet.concat(options, (error, response, data) => {
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
      req.setTimeout(options.readTimeout, () => {
        hasReadTimeout = true
        req.abort()
      })
    }
  })
}

function get (options) {
  options.method = 'GET'
  return request(options)
}

function post (options) {
  options.method = 'POST'
  return request(options)
}

function parse (options, data, resolve, reject) {
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
  post
}
