import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import express from "express";
import fs from "fs";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT;

// const data = JSON.parse(fs.readFileSync("./data.json"));
const data = [];

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);
    let dataToBeSent = JSON.parse(data);
    dataToBeSent = JSON.stringify(dataToBeSent);
    // ws.send(dataToBeSent, (err) => {
    //   if (err) {
    //     console.log(`Error occured!`);
    //   } else {
    //     console.log("Message sent");
    //   }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
  // });

  let count = 0;

  const interval = setInterval(() => {
    const message = {
      user: faker.name.firstName(),
      userId: nanoid(),
      message: faker.random.words(),
      messageId: nanoid(),
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
