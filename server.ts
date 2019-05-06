import { alexa } from "./src/app";
import * as config from "./src/config";

console.log("Running for Alexa");
alexa.startServer(config.server.port);
