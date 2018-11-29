'use strict'

module.exports = class ReadTimeoutError extends Error {
  constructor () {
    super('Request timed out')
    this.code = 'ERR_READ_TIMEOUT'
  }
}
