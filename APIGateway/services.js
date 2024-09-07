const services = {
	chat: {
		route: "/chat",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3001"
				: "https://chat.services.hola.donaldreddy.xyz",
	},
	friendRequest: {
		route: "/friend-request",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3002"
				: "https://friend-request.services.hola.donaldreddy.xyz",
	},
	groupInvites: {
		route: "/group-invite",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3003"
				: "https://chatapp-websocket-service.onrender.com/socket.io", //not hosted yet
	},
	group: {
		route: "/group",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3004"
				: "https://chatapp-websocket-service.onrender.com/socket.io", //not hosted yet
	},
	message: {
		route: "/message",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3005"
				: "https://message.services.hola.donaldreddy.xyz",
	},
	session: {
		route: "/session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3006"
				: "https://session.services.hola.donaldreddy.xyz",
	},
	user: {
		route: "/user",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007"
				: "https://user.services.hola.donaldreddy.xyz",
	},

	ws: {
		route: "/socket.io",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3008/socket.io"
				: "https://ws.server.hola.donaldreddy.xyz/socket.io",
		type: "ws",
	},
	wsSession: {
		route: "/ws-session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3009"
				: "https://ws-session.services.hola.donaldreddy.xyz",
	},
};

export default services;
