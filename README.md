# simple-json-request

[![Greenkeeper badge](https://badges.greenkeeper.io/SerayaEryn/simple-json-request.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/SerayaEryn/simple-json-request.svg?branch=master)](https://travis-ci.org/SerayaEryn/simple-json-request)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/simple-json-request/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/simple-json-request?branch=master)
[![NPM version](https://img.shields.io/npm/v/simple-json-request.svg?style=flat)](https://www.npmjs.com/package/simple-json-request)

A simple module to make json requests with Promise support, that wraps around the [simple-get](https://github.com/feross/simple-get) module.

## Installation
```
npm install simple-json-request
```
## Usage

```js
const request = require('simple-json-request')

request.request({
  method: 'GET',
  url: 'http://example.com'
})
  .then((data) => {
    // ...
  })
  .catch((error) => {
    // ...
  });
```
## API
### request(options)
Executes a request with the specified `options`. Returns a promise that either resolves the parsed data or rejects with an error.
### get(options)
A convenience function that uses the method `GET` by default.
### post(options)
A convenience function that uses the method `POST` by default.
### options
#### url
The url to request.
#### method
The http method. Supports `GET`, `POST`, `PUT`, `PATCH`, `HEAD` and `DELETE`.
#### timeout
Allows to set a timeout in milliseconds on the request.
#### headers
Allows to pass headers with the request.
#### body
The body of a post request.
#### form
The form data of a post request with `Content-Type` : `application/x-www-form-urlencoded`.
#### maxRedirects
The maximum number of redirects to follow in a request. Defaults to `10`.
## License

[MIT](./LICENSE)
