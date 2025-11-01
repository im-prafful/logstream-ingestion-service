export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: {
    require: boolean;
    rejectUnauthorized: boolean;
  };
}

export interface ApplicationRow {
  app_id: string;
}
