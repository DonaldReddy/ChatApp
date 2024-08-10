import "dotenv/config";
import { server } from "./webSocket.js";
import dbConnect from "./src/dataBase/dbConnect.js";

const PORT = process.env.PORT || 3007;

async function startServer() {
	try {
		await dbConnect();
		server.listen(PORT, () => {
			console.log(`WebSocket server is running at ${PORT}`);
		});
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
}

startServer();
