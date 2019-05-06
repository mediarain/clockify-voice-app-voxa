import "source-map-support/register";

import * as Raven from "raven";
import * as RavenLambdaWrapper from "serverless-sentry-lib";

import { alexa } from "./app";

export const alexaLambda = RavenLambdaWrapper.handler(Raven, alexa.lambda());
export const handler = RavenLambdaWrapper.handler(Raven, alexa.lambda());
