import { errorMessage, sourceData, parsedDataList } from "../config/constant";
import { LogLevel } from "../types/constant.types";
import { InsertFunctionReturn } from "../types/log.types";

const getRandom = <T>(arr: readonly T[] | T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const insertFnc = (): InsertFunctionReturn => {
  const level = getRandom(["information", "warning", "error", "debug"]) as LogLevel;

  const mssg = getRandom(errorMessage[level]);

  const sourceMssg = getRandom(sourceData);

  const parsedMessages = parsedDataList[sourceMssg] || ['{"error": "No parsed data available for this source"}'];
  const parsedData = getRandom(parsedMessages);

  return {
    level,
    mssg,
    sourceMssg,
    parsedData,
  };
};