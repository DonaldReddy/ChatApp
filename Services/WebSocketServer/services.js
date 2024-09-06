const services = {
	wsSession: {
		route: "/ws-session",
		target: process.env.IS_DEV
			? "http://localhost:3009"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
};

export default services;
