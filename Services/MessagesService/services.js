const services = {
	chat: {
		route: "/chat",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3001"
				: "https://chat.services.hola.donaldreddy.xyz",
	},
	user: {
		route: "/user",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007"
				: "https://user.services.hola.donaldreddy.xyz",
	},
};

export default services;
