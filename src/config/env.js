'use strict';

function getEnv() {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  return 'local';
}

module.exports = getEnv;
