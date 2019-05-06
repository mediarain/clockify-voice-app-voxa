import * as _ from "lodash";
import * as Raven from "raven";
import {
  AlexaEvent,
  AlexaPlatform,
  IVoxaReply,
  plugins,
  State,
  VoxaApp,
  VoxaEvent,
} from "voxa";
import * as config from "../config/index";
import * as ClockifyModel from "./model";
import { register as states } from "./states";
import * as variables from "./variables";
import * as views from "./views.json";

let environment = process.env.NODE_ENV || "production";

if (_.includes(["local", "local.example"], environment)) {
  environment = "production";
}

// tslint:disable-next-line
const defaultFulfillIntents = require(`../content/${environment}-canfulfill-intents.json`);

const { Model } = ClockifyModel;

export const voxaApp = new VoxaApp({ Model, views, variables });
export const alexa = new AlexaPlatform(voxaApp, { defaultFulfillIntents });

states(voxaApp);

plugins.replaceIntent(voxaApp);

/**
 * Load Clockify Service and timezone into the model
 */
voxaApp.onRequestStarted(async (voxaEvent: VoxaEvent) => {
  if (voxaEvent instanceof AlexaEvent && !voxaEvent.model.timezone) {
    const timezone = await voxaEvent.alexa.deviceSettings.getTimezone();

    console.log("onRequestStarted timezone", timezone);
    voxaEvent.model.newSession(timezone);
  }

  console.log("initClockify");

  voxaEvent.model.initClockify(voxaEvent.user.accessToken);
});

voxaApp.onBeforeStateChanged((voxaEvent: VoxaEvent, reply: IVoxaReply, state: State) => {
  Raven.captureBreadcrumb({
    category: "State Machine",
    data: {
      state: state.name
    },
    message: "Changed State",
  });
});

/**
 * Save the user
 */
voxaApp.onBeforeReplySent(async (voxaEvent, reply, transition) => {
  if (transition.to === "die") {
    voxaEvent.model.reply = undefined;
  } else {
    voxaEvent.model.reply = _.pickBy({
      facebookSuggestionChips: transition.facebookSuggestionChips,
      flow: transition.flow,
      reprompt: transition.reprompt,
      say: transition.say,
      text: transition.text || transition.say,
      to: transition.to,
    });

    if (transition.reply) {
      voxaEvent.model.reply.reprompt = `${transition.reply}.reprompt`;
      voxaEvent.model.reply.say = `${transition.reply}.say`;
      voxaEvent.model.reply.text = `${transition.reply}.text` || `${transition.reply}.say`;
    }
  }

  voxaEvent.log.debug('onBeforeReplySent', JSON.stringify(reply, null, 2));

  return reply;
});

/**
 * Handle error
 */
voxaApp.onError(async (voxaEvent: VoxaEvent, error: Error, voxaReply: IVoxaReply) => {
  voxaEvent.log.debug("SESSION ATTRIBUTES", JSON.stringify(voxaEvent.model, null, 2));
  voxaEvent.log.error(error);

  Raven.captureException(error);

  return voxaReply;
});
