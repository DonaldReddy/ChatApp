const services = {
	group: {
		route: "/group",
		target: process.env.IS_DEV
			? "http://localhost:3004"
			: "https://chatapp-user-service.onrender.com",
	},
	message: {
		route: "/message",
		target: process.env.IS_DEV
			? "http://localhost:3005"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
};

export default services;
