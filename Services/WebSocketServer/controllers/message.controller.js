import { io } from "../webSocket.js";

export async function sendMessageEvent(req, res) {
	try {
		const { wsIds, message } = req.body;
		console.log("Sending message to wsIds:", wsIds, "Message:", message);

		for (const wsId of wsIds) {
			if (io.sockets.sockets.get(wsId)) {
				io.to(wsId).emit("MESSAGE", message);
				console.log(`Message sent to socket ID: ${wsId}`);
			} else {
				console.error(`Socket ID ${wsId} not connected`);
			}
		}

		res.status(200).send({ status: true, message: "Message sent" });
	} catch (error) {
		console.error("Error sending message:", error);
		res.status(500).send({ status: false, error: "Failed to send message" });
	}
}
