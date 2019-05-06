"use strict";

const _ = require("lodash");
const AWS = require("aws-sdk");
const https = require("https");
const path = require("path");

const env = require("./env")().toLowerCase();

const configFile = require(path.join(__dirname, `${env}.json`));

AWS.config.update(
  _.merge(
    {
      httpOptions: {
        /**
         * See known issue: https://github.com/aws/aws-sdk-js/issues/862
         */
        agent: new https.Agent({
          ciphers: "ALL",
          keepAlive: false,
          rejectUnauthorized: true,
          secureProtocol: "TLSv1_method"
        }),
        timeout: 4000
      },
      maxRetries: 8
    },
    configFile.aws
  )
);

configFile.env = env;

module.exports = configFile;
module.exports.asFunction = () => configFile;
