import * as mime from "alexa-mime";
import * as _ from "lodash";
import * as nock from "nock";
import * as path from "path";
import * as simple from "simple-mock";
import * as tk from "timekeeper";

import * as views  from "../src/app/views.json";
import * as config from "../src/config";
import * as skill from "../src/handler";

const describeWrapper = {
  firstTimeNoToken: () => {
    tk.freeze(new Date("2018-10-29T16:00:00.000Z")); // Afternoon
  },
};

mime(
  skill,
  views.en.translation,
  path.join(__dirname, "use-cases"),
  path.join(__dirname, "..", "reports", "simulate"),
  describeWrapper
);
