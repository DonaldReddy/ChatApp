import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import services from "./services.js";

const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
	socket.emit("welcome", socket.id);
	console.log(socket.id, "connected");
	socket.on("disconnect", async () => {
		try {
			console.log(socket.id, "disconnected");
			console.log(`${services.wsSession.target}/api/v1/ws-session/delete`);

			await axios.post(
				`${services.wsSession.target}/api/v1/ws-session/delete-ws-session`,
				{
					wsId: socket.id,
				},
			);
			console.log("deleted ws session for " + socket.id);
		} catch (error) {
			console.error(
				"Error deleting ws session for " + socket.id,
				error.message,
			);
		}
	});
});

export { server };
