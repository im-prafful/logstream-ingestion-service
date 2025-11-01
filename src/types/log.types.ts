import type { LogLevel } from "./constant.types";

export interface InsertFunctionReturn {
  level: LogLevel;
  mssg: string;
  sourceMssg: string;
  parsedData: string;
};

export interface LogEntry {
  level: string;
  mssg: string;
  sourceMssg: string;
  parsedData: string;
};
