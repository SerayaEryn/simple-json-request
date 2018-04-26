'use strict';

const simpleGet = require('simple-get');
const HttpError = require('./lib/HttpError');
const JsonParseError = require('./lib/JsonParseError');

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
        reject(new HttpError(response.statusCode));
      } else {
        parse(data, resolve, reject);
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

function parse(data, resolve, reject) {
  try {
    const parsedData = JSON.parse(data.toString());
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