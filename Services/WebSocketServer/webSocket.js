import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import services from "./services.js";

const server = createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {

	socket.emit("INIT");

	socket.on("INIT", async (userName) => {
		try {
			await axios.post(
				`${services.wsSession.target}/api/v1/ws-session/create-new-ws-session`,
				{
					userName,
					wsId: socket.id,
				},
			);
		} catch (error) {
			console.error(
				"Error creating ws session for " + socket.id,
				error.message,
			);
		}
	});

	socket.on("disconnect", async () => {
		try {
			await axios.post(
				`${services.wsSession.target}/api/v1/ws-session/delete-ws-session`,
				{
					wsId: socket.id,
				},
			);
		} catch (error) {
			console.error(
				"Error deleting ws session for " + socket.id,
				error.message,
			);
		}
	});
});

export { server, io };
