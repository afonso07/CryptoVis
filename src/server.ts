import helmet from "helmet";
import express from "express";
import cors from "cors"; // This is Cross Origin Resource Sharing also middlware https://www.npmjs.com/package/cors
import morgan from "morgan";
import WebSocket from "ws";
import * as http from "http";

const app = express();
const corsOptions = {
  //For production: origin: "https://nplfn.azurewebsites.net"
  origin: process.env["ORIGIN"],
};
app.use(cors(corsOptions)); //Mounting middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
const server = http.createServer(app);

// ? API reference https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md
// ? How to use websockets https://www.npmjs.com/package/ws#sending-and-receiving-text-data
// ? Q&A websockets https://stackoverflow.com/questions/60357324/cannot-connect-to-binance-websocket-i-get-websocketbadstatusexception-handsha

const conn = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@aggTrade");
const wss = new WebSocket.Server({ server });

/**
 * ? function that will be triggered by the ‘connection’ event (line 13): it is responsible to handle all the incoming connections from clients.
 * https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
 */
wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);

    wss.clients.forEach((client) => {
      if (client != ws) {
        console.log("This is the client");
      }
    });
    ws.send(`Hello, you sent -> ${message}`);
  });
  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});
/*conn.on("open", () => {
  console.log("Websocket open");
  /*conn.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["btcusdt@aggTrade", "btcusdt@depth"],
      id: 1,
    })
  );
});

conn.on("message", (message) => {
  console.log(message);
});
conn.on("error", (err) => {
  console.error("There was an error! ", err);
});*/

app.get("/", (req, res) => {
  res.json({ message: "Welcome Crypto Vis" });
});

const PORT = process.env.PORT || 8999;
server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
