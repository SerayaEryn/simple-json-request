'use strict';

module.exports = class JsonParseError extends Error {
  constructor(data) {
    super('Failed to parse data!');
    this.code = 'ERR_JSON_PARSE';
    this.data = data;
  }
}
