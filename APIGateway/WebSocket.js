import { Server } from "socket.io";
import app from "./app.js";
import { createServer } from "http";

const server = createServer(app);

const io = new Server(server, { cors: { origin: "donaldreddy.xyz" } });

io.on("connection", (socket) => {
	console.log(socket.handshake.headers.origin);
});

export { server };
