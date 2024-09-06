const services = {
	user: {
		route: "/user",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007"
				: "https://chatapp-user-service.onrender.com",
	},
};

export default services;
