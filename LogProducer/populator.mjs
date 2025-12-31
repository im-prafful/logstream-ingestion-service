import { errorMessage, parsedDataList, sourceData } from "./constant.js";

const SEMANTIC_MAPPING = {
  "auth-service": {
    messageKeywords: [
      "login",
      "password",
      "auth",
      "token",
      "session",
      "signup",
      "logout",
      "2fa",
    ],
  },
  "payment-service": {
    messageKeywords: [
      "payment",
      "order",
      "transaction",
      "gateway",
      "stripe",
      "paypal",
      "refund",
      "funds",
    ],
  },
  "api-backend": {
    messageKeywords: [
      "API",
      "endpoint",
      "request",
      "response",
      "status",
      "500",
      "404",
      "latency",
    ],
  },
  "frontend-web": {
    messageKeywords: [
      "component",
      "browser",
      "DOM",
      "render",
      "load",
      "click",
      "css",
    ],
  },
  "redis-worker": {
    messageKeywords: ["queue", "job", "cache", "redis", "worker", "latency"],
  },
  "db-poller": {
    messageKeywords: [
      "database",
      "query",
      "table",
      "rows",
      "sql",
      "connection",
    ],
  },
  // Default fallback for other services to ensure they get generic system messages
  default: {
    messageKeywords: [
      "service",
      "system",
      "process",
      "started",
      "failed",
      "retry",
    ],
  },
};

const getWeightedLevel = () => {
  const rand = Math.random();

  if (rand < 0.7) {
    const benign = ["information", "debug"];
    return benign[Math.floor(Math.random() * benign.length)];
  } else {
    const critical = ["warning", "error"];
    return critical[Math.floor(Math.random() * critical.length)];
  }
};

const getCoherentMessage = (level, source) => {
  const availableMessages = errorMessage[level];
  const mapping = SEMANTIC_MAPPING[source] || SEMANTIC_MAPPING["default"];
  const keywords = mapping.messageKeywords;

  const matchingMessages = availableMessages.filter((msg) =>
    keywords.some((keyword) =>
      msg.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  if (matchingMessages.length === 0) {
    return availableMessages[
      Math.floor(Math.random() * availableMessages.length)
    ];
  }

  return matchingMessages[Math.floor(Math.random() * matchingMessages.length)];
};

export const insertFnc = () => {
  const sourceMssg = sourceData[Math.floor(Math.random() * sourceData.length)];
  const level = getWeightedLevel();
  const mssg = getCoherentMessage(level, sourceMssg);
  const parsedOptions = parsedDataList[sourceMssg];

  // Safety check: if no parsed data exists for this source, return null or generic
  let parsedData = "{}";
  if (parsedOptions && parsedOptions.length > 0) {
    parsedData =
      parsedOptions[Math.floor(Math.random() * parsedOptions.length)];
  }

  return {
    level,
    mssg,
    sourceMssg,
    parsedData,
  };
};
