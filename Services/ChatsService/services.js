const services = {
	group: {
		route: "/group",
		target: process.env.IS_DEV
			? "http://localhost:3004"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
	message: {
		route: "/message",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3005"
				: "https://message.services.hola.donaldreddy.xyz",
	},
};

export default services;
