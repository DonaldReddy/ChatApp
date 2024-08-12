import "dotenv/config";
import app from "./app.js";
import dbConnect from "./src/dataBase/dbConnect.js";

const PORT = process.env.PORT || 3009;

async function startServer() {
	try {
		await dbConnect();
		app.listen(PORT, () => {
			console.log(`WebSocket Session Service is running at ${PORT}`);
		});
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
}

startServer();
