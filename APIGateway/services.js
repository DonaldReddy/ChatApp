const services = {
	chat: {
		route: "/chat",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3001"
				: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
	friendRequest: {
		route: "/friend-request",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3002"
				: "https://chatapp-user-service.onrender.com",
	},
	groupInvites: {
		route: "/group-invite",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3003"
				: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
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
				: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
	session: {
		route: "/session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3006"
				: "https://chatapp-session-service.onrender.com",
	},
	user: {
		route: "/user",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007"
				: "https://chatapp-user-service.onrender.com",
	},

	ws: {
		route: "/socket.io",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3008/socket.io"
				: "https://chatapp-websocket-service.onrender.com/socket.io",
		type: "ws",
	},
	wsSession: {
		route: "/ws-session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3009"
				: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
};

export default services;
