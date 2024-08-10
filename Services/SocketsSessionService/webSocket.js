import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app.js";

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log(`New connection: ${socket.id}`);

	io.emit("message", "hi");

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log(`Disconnected: ${socket.id}`);
	});
});

export { server };
