import "dotenv/config";
import { server } from "./webSocket.js";

const PORT = process.env.PORT || 3008;

async function startServer() {
	try {
		server.listen(PORT, async () => {
			console.log(`WebSocket Server running at ${PORT}`);
		});
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
}

startServer();
