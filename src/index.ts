import express, { Request, Response } from "express";

const app = express();
const port: number = 3000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hi from backend");
});

app.listen(port, (): void => {
  console.log(`App is running on port ${port}`);
});
