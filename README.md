# simple-json-request

![Build Status](https://github.com/SerayaEryn/simple-json-request/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/simple-json-request/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/simple-json-request?branch=master)
[![NPM version](https://img.shields.io/npm/v/simple-json-request.svg?style=flat)](https://www.npmjs.com/package/simple-json-request)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
Executes a request with the specified `options`. `options` may be a string representing a url. Returns a promise that either resolves the parsed data or rejects with an error.
### get(options)
A convenience function that uses the method `GET` by default.
### post(options)
A convenience function that uses the method `POST` by default.
### put(options)
A convenience function that uses the method `PUT` by default.
### delete(options)
A convenience function that uses the method `DELETE` by default.
### head(options)
A convenience function that uses the method `HEAD` by default.
### patch(options)
A convenience function that uses the method `PATCH` by default.
### options

#### url

The url to request.

#### method

The http method. Supports `GET`, `POST`, `PUT`, `PATCH`, `HEAD` and `DELETE`.

#### timeout

Allows to set a socket timeout in milliseconds.

#### headers

Allows to pass headers with the request.

#### body

The body of a post request.

#### form

The form data of a post request with `Content-Type` : `application/x-www-form-urlencoded`.

#### readTimeout

Allows to set a read timeout in milliseconds.

#### maxRedirects

The maximum number of redirects to follow in a request. Defaults to `10`.

### parser

Allows to specify a custom json parser like [turbo-json-parse](https://github.com/mafintosh/turbo-json-parse).

## License

[MIT](./LICENSE)
