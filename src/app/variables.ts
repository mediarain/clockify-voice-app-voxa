import { IVoxaEvent } from "voxa";

import * as config from "../config/index";

export function accountLinkingCard() {
  return {
    type: "LinkAccount",
  };
}

export function confirmCard(voxaEvent: IVoxaEvent) {
  const { taskToLog } = voxaEvent.model;

  return {
    content: `Description: ${taskToLog.description}\n\nTime: ${voxaEvent.model.getDurationForUser()}\n\nTask: ${taskToLog.taskName}\n\nProject: ${taskToLog.projectName}`,
    title: "Confirm Entry",
    type: "Simple",
  };
}

export function progressCard(voxaEvent: IVoxaEvent) {
  const { taskToLog } = voxaEvent.model;
  let content;

  if (taskToLog.projectName) {
    content = `Project: ${taskToLog.projectName}\n\n`;
  }

  if (taskToLog.taskName) {
    content = `${content}Task: ${taskToLog.taskName}\n\n`;
  }

  if (taskToLog.description) {
    content = `${content}Description: ${taskToLog.description}`;
  }

  return {
    content,
    title: "Task Entry",
    type: "Simple",
  };
}

export function description(voxaEvent: IVoxaEvent) {
  return voxaEvent.model.taskToLog.description;
}

export function projectName(voxaEvent: IVoxaEvent) {
  return voxaEvent.model.taskToLog.projectName;
}

export function taskName(voxaEvent: IVoxaEvent) {
  return voxaEvent.model.taskToLog.taskName;
}

export function duration(voxaEvent: IVoxaEvent) {
  return voxaEvent.model.getDurationForUser(true);
}
