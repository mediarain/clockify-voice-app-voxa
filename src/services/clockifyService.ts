import * as Bluebird from "bluebird";
import { LambdaLog } from "lambda-log";
import * as _ from "lodash";
import * as moment from "moment-timezone";
import * as Raven from "raven";
import * as rp from "request-promise";

import { ITaskToLog } from "./ITaskToLog";

const lambdaLog = new LambdaLog({ debug: true });

const NICASOURCE_WORKSPACE_ID = '5c06c9c7b0798723e0fcd47c';
const TIME_OFF_TASK_ID = '5c06d4abb0798723e0fcfa27';
const LUNCH_TIME_ID = '5c06d4cdb0798723e0fcfa9a';
const MY_PERSONAL_USER_ID = '5c47b777b079875a5658b797';

export class ClockifyService {
  constructor(
    public apiKey: string,
    public userId: string,
    public timezone: string,
  ) {}

  public async getTaskByName(projectId: string, taskName: string): Promise<any> {
    const path = `api/workspaces/${NICASOURCE_WORKSPACE_ID}/projects/${projectId}/tasks/`;
    const result: any = await this.getRequest(path);

    return _.find(result, x => _.includes(x.name.toLowerCase(), taskName.toLowerCase()));
  }

  public async getProjectByName(projectName: string): Promise<any> {
    const path = `api/workspaces/${NICASOURCE_WORKSPACE_ID}/projects/`;
    const result: any = await this.getRequest(path);

    return _.find(result, x => _.includes(x.name.toLowerCase(), projectName.toLowerCase()));
  }

  public async logLunch(): Promise<any> {
    const dayOfWeekArray = [1, 2, 3, 4, 5];

    return Bluebird.map(dayOfWeekArray, (dayOfWeek) => {
      const midday = moment().tz(this.timezone).day(dayOfWeek).startOf('day').add(12, 'hours');

      const taskToLog: ITaskToLog = {
        description: 'Lunch',
        end: midday.clone().add(30, 'minutes').toISOString(),
        projectId: TIME_OFF_TASK_ID,
        start: midday.toISOString(),
        taskId: LUNCH_TIME_ID,
      };

      return this.logTask(taskToLog);
    });
  }

  public async logTaskFromUser(taskToLog: ITaskToLog): Promise<any> {
    const millis = moment.duration(taskToLog.duration).asMilliseconds();
    const start = moment().tz(this.timezone).startOf('day').add(8, 'hours');

    taskToLog.start = start.toISOString();
    taskToLog.end = start.clone().add(millis, 'milliseconds').toISOString();

    return this.logTask(taskToLog);
  }

  public logTask(taskToLog: ITaskToLog) {
    const body = _.pick(taskToLog,
      'start',
      'description',
      'projectId',
      'taskId',
      'end',
    );

    const path = `api/workspaces/${NICASOURCE_WORKSPACE_ID}/timeEntries/`;

    return this.getRequest(path, 'POST', body);
  }

  public async isLunchAlreadyLogged(): Promise<boolean> {
    const today = moment().tz(this.timezone);
    const path = `api/workspaces/${NICASOURCE_WORKSPACE_ID}/timeEntries/user/${this.userId}/`;

    const lunchData: any = {
      projectId: "5c06d4abb0798723e0fcfa27",
      taskId: "5c06d4cdb0798723e0fcfa9a",
    };

    let result: any = await this.getRequest(path);

    result = _(result.timeEntriesList)
      .filter((x) => {
        const isSameDay = _.startsWith(_.get(x, "timeInterval.start"), today.format('YYYY-MM-DD')) &&
          _.startsWith(_.get(x, "timeInterval.end"), today.format('YYYY-MM-DD'));

        return x.projectId === lunchData.projectId &&
          x.taskId === lunchData.taskId &&
          isSameDay;
      })
      .value();

    return !_.isEmpty(result);
  }

  private getRequest(path: string, method: string = 'GET', body?: any) {
    const params = {
      body,
      headers: {
        'X-Api-Key': this.apiKey,
      },
      json: true,
      method,
      uri: `https://api.clockify.me/${path}`,
    };

    lambdaLog.debug('getRequest', params);

    return rp(params);
  }
}
