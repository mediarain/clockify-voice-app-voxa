import * as _ from "lodash";
import * as momentDuration from "moment-duration-format";
import * as moment from "moment-timezone";

import * as config from "../config/index";
import { ClockifyService, ITaskToLog } from "../services/";

momentDuration(moment);

export class Model {

  public static deserialize(data: any, voxaEvent: any): Promise<Model>|Model {
    return new this(data);
  }
  public clockifyService: ClockifyService;
  public taskToLog: ITaskToLog;
  public timezone: string;

  constructor(data: any = {}) {
    _.assign(this, data);
  }

  public initClockify(accessToken: string = "") {
    const [userKey, userId] = accessToken.split(",");
    this.clockifyService = new ClockifyService(userKey, userId, this.timezone);
  }

  public newSession(timezone: string) {
    this.timezone = timezone || config.timezone;
  }

  public calculateDuration() {
    const { timeOne, timeTwo } =  this.taskToLog;
    const durationOne = moment.duration(timeOne);

    if (timeTwo) {
      const durationTwo = moment.duration(timeTwo);
      const totalInMillis = durationOne.asMilliseconds() + durationTwo.asMilliseconds();

      this.taskToLog.duration = moment.duration(totalInMillis);
    } else {
      this.taskToLog.duration = durationOne;
    }
  }

  public getDurationForVoice() {
    const { timeOne, timeTwo } =  this.taskToLog;
    const durationOne = moment.duration(timeOne);

    if (timeTwo) {
      const durationTwo = moment.duration(timeTwo);
      const totalInMillis = durationOne.asMilliseconds() + durationTwo.asMilliseconds();

      this.taskToLog.duration = moment.duration(totalInMillis);
    } else {
      this.taskToLog.duration = durationOne;
    }
  }

  public getDurationForUser(isHumanize?: boolean) {
    const taskDuration: momentDuration = moment.duration(this.taskToLog.duration);
    const minutes = taskDuration.asMinutes();

    if (minutes % 60 !== 0 && minutes > 60) {
      const hours = _.toInteger(minutes / 60);
      const minutesDuration = taskDuration.clone().subtract(hours, 'h');
      const hoursDuration = taskDuration.clone().subtract(minutesDuration);

      if (isHumanize) {
        return `${hoursDuration.humanize()} and ${minutesDuration.humanize()}`;
      }
    }

    if (isHumanize || minutes < 60) {
      return taskDuration.humanize();
    }

    return taskDuration.format("h:mm");
  }

  public resetTask() {
    delete this.taskToLog;
  }

  public serialize(): any|Promise<any> {
    return this;
  }
};
