export type LogLevel = "information" | "warning" | "error" | "debug";

export type ErrorMessageMap = Record<LogLevel, string[]>;

export type ParsedDataMap = Record<string, string[]>;
