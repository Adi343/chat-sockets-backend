import { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import fs from "fs";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT;

// const data = JSON.parse(fs.readFileSync("./data.json"));
const data = [];

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });

  let count = 0;

  const interval = setInterval(() => {
    const message = {
      user: faker.name.firstName(),
      message: faker.random.words(),
    };
    ws.send(JSON.stringify(message));
    count += 1;
    if (count >= 20) {
      clearInterval(interval);
    }
    return;
  }, 1000);
});
server.listen(port, () => {
  console.log(`Listening on ws://localhost:${port}`);
});
