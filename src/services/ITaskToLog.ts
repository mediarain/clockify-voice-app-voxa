import * as moment from "moment-timezone";

export interface ITaskToLog {
  description: string;
  duration?: moment.Duration;
  end: string;
  projectId: string;
  projectName?: string;
  start: string;
  taskId: string;
  taskName?: string;
  timeOne?: string;
  timeTwo?: string;
}
