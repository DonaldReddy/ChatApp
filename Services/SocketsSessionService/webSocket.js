import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
	console.log(socket.id);
	socket.on("disconnect", () => {
		console.log(socket.id, "disconnected");
	});
	socket.on("message", (message) => {
		socket.emit("message", message);
	});
});

export default server;
