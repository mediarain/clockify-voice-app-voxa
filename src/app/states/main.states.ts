import * as _ from "lodash";
import { IVoxaEvent, VoxaApp } from "voxa";
import { ITaskToLog } from "../../services"

export function register(voxaApp: VoxaApp) {
  //  INTENTS

  voxaApp.onIntent("LogLunchIntent", () => ({ to: "logLunch" }));
  voxaApp.onIntent("SearchIntent", () => ({ to: "taskSetup" }));
  voxaApp.onIntent("LaunchIntent", () => ({ to: "launch" }));
  voxaApp.onIntent("RepeatIntent", () => ({ to: "repeat" }));
  voxaApp.onIntent("YesIntent", () => ({ to: "repeat" }));
  voxaApp.onIntent("NoIntent", () => ({ to: "exit" }));
  voxaApp.onIntent("CancelIntent", () => ({ to: "exit" }));
  voxaApp.onIntent("StopIntent", () => ({ to: "exit" }));
  voxaApp.onIntent("DefaultFallbackIntent", () => ({ to: "unhandled" }));
  voxaApp.onIntent("FallbackIntent", () => ({ to: "unhandled" }));

  voxaApp.onIntent("StartOverIntent", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog = {};

    return { to: "launch" };
  });

  //  STATES

  voxaApp.onState("launch", async (voxaEvent: IVoxaEvent) => {
    if (!voxaEvent.user.accessToken) {
      return {
        alexaCard: "Launch.AccountLinkingCard",
        flow: "terminate",
        say: "Launch.NoAccessToken.say",
      };
    }

    const reply: string[] = ["Launch.Welcome.say"];

    if (voxaEvent.session.new) {
      reply.unshift("Launch.Welcome.init");
    }

    return {
      flow: "yield",
      reprompt: "Launch.Welcome.say",
      say: reply,
      to: "entry",
    };
  });

  voxaApp.onState("logLunch", async (voxaEvent: IVoxaEvent) => {
    const isLogged = await voxaEvent.model.clockifyService.isLunchAlreadyLogged();

    if (isLogged) {
      return {
        flow: "terminate",
        say: "Task.Lunch.AlreadyLogged.say",
      };
    }

    await voxaEvent.model.clockifyService.logLunch();

    return {
      flow: "yield",
      reprompt: "Task.Lunch.Logged.reprompt",
      say: "Task.Lunch.Logged.say",
      to: "entry",
    };
  });

  voxaApp.onState("taskSetup", { to: "logLunch" }, "LogLunchIntent");
  voxaApp.onState("taskSetup", { to: "exit" }, ["CancelIntent", "StopIntent"]);

  voxaApp.onState("taskSetup", async (voxaEvent: IVoxaEvent) => {
    const search: string = _.get(voxaEvent, "intent.params.search");
    const taskToLog: ITaskToLog = voxaEvent.model.taskToLog || {};
    voxaEvent.model.taskToLog = taskToLog;

    if (search) {
      if (taskToLog.taskId) {
        voxaEvent.model.taskToLog.description = _.capitalize(search);

        return {
          alexaCard: "Task.ProgressCard",
          flow: "yield",
          reprompt: "Task.ConfirmDescription.say",
          say: "Task.ConfirmDescription.say",
          to: "confirmDescription",
        };
      }

      if (taskToLog.projectId) {
        voxaEvent.model.taskToLog.taskName = search;

        const task = await voxaEvent.model.clockifyService.getTaskByName(taskToLog.projectId, search);

        if (task) {
          voxaEvent.model.taskToLog.taskId = task.id;
          voxaEvent.model.taskToLog.taskName = task.name;

          return {
            alexaCard: "Task.ProgressCard",
            flow: "yield",
            reprompt: "Task.ConfirmTask.say",
            say: "Task.ConfirmTask.say",
            to: "confirmTask",
          };
        }

        return {
          alexaCard: "Task.ProgressCard",
          flow: "yield",
          reprompt: "Task.InvalidTask.say",
          say: "Task.InvalidTask.say",
          to: "taskSetup",
        };
      }

      voxaEvent.model.taskToLog.projectName = search;

      const project = await voxaEvent.model.clockifyService.getProjectByName(search);

      if (project) {
        voxaEvent.model.taskToLog.projectId = project.id;
        voxaEvent.model.taskToLog.projectName = project.name;

        return {
          alexaCard: "Task.ProgressCard",
          flow: "yield",
          reprompt: "Task.ConfirmProject.say",
          say: "Task.ConfirmProject.say",
          to: "confirmProject",
        };
      }

      return {
        flow: "yield",
        reprompt: "Task.InvalidProject.say",
        say: "Task.InvalidProject.say",
        to: "taskSetup",
      };
    }

    if (taskToLog.taskId) {
      return {
        alexaCard: "Task.ProgressCard",
        flow: "yield",
        reprompt: "Task.WhatDescription.say",
        say: "Task.WhatDescription.say",
        to: "taskSetup",
      };
    }

    if (taskToLog.projectId) {
      return {
        alexaCard: "Task.ProgressCard",
        flow: "yield",
        reprompt: "Task.WhatTask.say",
        say: "Task.WhatTask.say",
        to: "taskSetup",
      };
    }

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatProject.say",
      say: "Task.WhatProject.say",
      to: "taskSetup",
    };
  });

  voxaApp.onState("confirmProject", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.projectConfirmed = true;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatTask.say",
      say: "Task.WhatTask.say",
      to: "taskSetup",
    };
  }, "YesIntent");

  voxaApp.onState("confirmProject", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.projectId = undefined;
    voxaEvent.model.taskToLog.projectName = undefined;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatProject.say",
      say: "Task.WhatProject.say",
      to: "taskSetup",
    };
  }, "NoIntent");

  voxaApp.onState("confirmTask", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.taskConfirmed = true;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatDescription.say",
      say: "Task.WhatDescription.say",
      to: "taskSetup",
    };
  }, "YesIntent");

  voxaApp.onState("confirmTask", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.taskId = undefined;
    voxaEvent.model.taskToLog.taskName = undefined;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatTask.say",
      say: "Task.WhatTask.say",
      to: "taskSetup",
    };
  }, "NoIntent");

  voxaApp.onState("confirmDescription", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.descriptionConfirmed = true;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.HowMuchTime.say",
      say: "Task.HowMuchTime.say",
      to: "finishTaskSetup",
    };
  }, "YesIntent");

  voxaApp.onState("confirmDescription", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.taskToLog.description = undefined;

    return {
      alexaCard: "Task.ProgressCard",
      flow: "yield",
      reprompt: "Task.WhatDescription.say",
      say: "Task.WhatDescription.say",
      to: "taskSetup",
    };
  }, "NoIntent");

  voxaApp.onState("finishTaskSetup", (voxaEvent: IVoxaEvent) => {
    const { timeOne, timeTwo } = _.get(voxaEvent, "intent.params");
    voxaEvent.model.taskToLog.timeOne = timeOne;
    voxaEvent.model.taskToLog.timeTwo = timeTwo;

    voxaEvent.model.calculateDuration();

    return {
      alexaCard: "Task.Confirm.card",
      flow: "yield",
      reprompt: "Task.Confirm.reprompt",
      say: "Task.Confirm.say",
      to: "confirmEntry",
    };
  }, "LogTimeIntent");

  voxaApp.onState("finishTaskSetup", { to: "exit" }, ["CancelIntent", "StopIntent"]);

  voxaApp.onState("finishTaskSetup", {
    flow: "yield",
    reprompt: "Task.HowMuchTime.say",
    say: ["NotUnderstood.say", "Task.HowMuchTime.say"],
  });

  voxaApp.onState("confirmEntry", async (voxaEvent: IVoxaEvent) => {
    await voxaEvent.model.clockifyService.logTaskFromUser(voxaEvent.model.taskToLog);

    voxaEvent.model.resetTask();

    return {
      flow: "yield",
      reprompt: "Task.Done.reprompt",
      say: "Task.Done.say",
      to: "newTask",
    };
  }, "YesIntent");

  voxaApp.onState("confirmEntry", (voxaEvent: IVoxaEvent) => {
    voxaEvent.model.resetTask();

    return {
      flow: "continue",
      say: "Task.StartOver.say",
      to: "taskSetup",
    };
  }, "NoIntent");

  voxaApp.onState("newTask", { to: "launch" }, "YesIntent");
  voxaApp.onState("newTask", { to: "exit" }, "NoIntent");

  voxaApp.onState("repeat", (voxaEvent: IVoxaEvent) => {
    if (voxaEvent.session.new) {
      return { to: "launch" };
    }

    const lastReply = _.get(voxaEvent, "model.reply.say");
    const lastReprompt = _.get(voxaEvent, "model.reply.reprompt");
    const reply = _.isArray(lastReply) ? _.last(lastReply) : lastReply || [];
    const to = _.get(voxaEvent, "model.reply.to");

    return {
      flow: "yield",
      reprompt: lastReprompt,
      say: reply,
      to,
    };
  });

  voxaApp.onState("exit", {
    flow: "terminate",
    say: "Exit.say",
  });

  voxaApp.onUnhandledState((voxaEvent: IVoxaEvent, stateName: string): any => {
    if (voxaEvent.session.new || !voxaEvent.model.reply || voxaEvent.model.reply.to === "die") {
      return { to: "launch" };
    }

    const lastReply = voxaEvent.model.reply.say;
    const lastReprompt = _.get(voxaEvent, "model.reply.reprompt");
    let reply = _.isArray(lastReply) ? _.last(lastReply) : lastReply;
    reply = _.filter(_.concat("NotUnderstood.say", reply));

    const response: any = {
      flow: "yield",
      reprompt: lastReprompt,
      say: reply,
      to: voxaEvent.model.reply.to,
    };

    return response;
  });
};
