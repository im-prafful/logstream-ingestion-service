import { errorMessage, parsedDataList, sourceData } from "./constant.js";

export const insertFnc = () => {
  const levelList = ["information", "warning", "error", "debug"];
  const level = levelList[Math.floor(Math.random() * levelList.length)];

  const mssgList = errorMessage[level];
  const mssg = mssgList[Math.floor(Math.random() * mssgList.length)];

  const sourceMssg = sourceData[Math.floor(Math.random() * sourceData.length)];

  const parsedList = parsedDataList[sourceMssg];
  const parsedData = parsedList[Math.floor(Math.random() * parsedList.length)];

  return {
    level,
    mssg,
    sourceMssg,
    parsedData,
  };
};