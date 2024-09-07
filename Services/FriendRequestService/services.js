const services = {
	user: {
		route: "/user",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007"
				: "https://user.services.hola.donaldreddy.xyz",
	},
};

export default services;
