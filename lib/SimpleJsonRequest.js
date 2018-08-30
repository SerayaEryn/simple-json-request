'use strict';

const simpleGet = require('simple-get');
const HttpError = require('./HttpError');
const JsonParseError = require('./JsonParseError');

function request(options) {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers.accept = 'application/json';
  return new Promise((resolve, reject) => {
    simpleGet.concat(options, (error, response, data) => {
      if (error) {
        reject(error);
      } else if (response.statusCode >= 400) {
        reject(new HttpError(response.statusCode, data));
      } else {
        parse(options, data, resolve, reject);
      }
    });
  });
}

function get(options) {
  options.method = 'GET';
  return request(options);
}

function post(options) {
  options.method = 'POST';
  return request(options);
}

function parse(options, data, resolve, reject) {
  try {
    const parser = options.parser || JSON.parse
    const parsedData = parser(data.toString());
    resolve(parsedData);
  } catch (error) {
    reject(new JsonParseError(data));
  }
}

module.exports = {
  request,
  get,
  post
};