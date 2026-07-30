import express from "express";
import http from "http";
import cors from "cors";
import router from "./router";
import { PORT } from "../config";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome to Epey.com Smartphone Data API 🎉");
});

app.use("/", router());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
