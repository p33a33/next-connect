import next from "next";
import { Server } from "socket.io";
import { createServer } from "http";
import express, { Request, Response } from "express";
import { SocketMessageType } from "./socketMessageType";

const app = next({ dev: true });
const handle = app.getRequestHandler();
const port = 3000;

(async () => {
  await app.prepare();
  const server = express();
  const httpServer = createServer(server);
  const ioServer = new Server(httpServer);

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log("next server is on 3000");
  });

  ioServer.on("connection", (socket) => {
    console.log("a user connected");

    socket.on(SocketMessageType.NEW_USER, async (nickname) => {
      console.log(socket.id);
      console.log(nickname);

      socket.broadcast.emit(
        SocketMessageType.NEW_USER,
        `${nickname} in the house`
      );
    });

    socket.on(SocketMessageType.USER_OUT, (nickname) => {
      socket.broadcast.emit(SocketMessageType.USER_OUT, `${nickname} out.`);
    });

    // socket.on("disconnect", () => {
    //   socket.broadcast.emit(SocketMessageType.USER_OUT, `${socket.id} out.`);
    // });
  });
})();

export {};
