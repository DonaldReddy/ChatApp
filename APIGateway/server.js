import "dotenv/config";
// import { server } from "./WebSocket.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Gateway is running at ${PORT}`);
});
