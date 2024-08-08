import User from "../models/User.schema.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";

async function signUp(req, res) {
	try {
		const { userName, password, name } = req?.body;
		console.log(userName, password, name);
		const user = await User.findOne({ userName: userName });
		if (user) throw new Error("User already exist");
		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			userName: userName,
			password: hashPassword,
			name: name,
		});
		await newUser.save();
		res.status(200).send({ status: true, user: newUser.userName });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

async function signIn(req, res) {
	try {
		const { userName, password } = req?.body;
		console.log(userName, password);
		const user = await User.findOne({ userName: userName });
		if (!user) throw new Error("User doesn't exist");
		if (!(await bcrypt.compare(password, user.password)))
			throw new Error("Invalid credentials");
		await updateLastSeen(req, res, false);
		res.status(200).send({ status: true, user: user.userName });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

async function updateLastSeen(req, res, isHTTP = true) {
	try {
		const { userName } = req?.body;
		console.log(userName);
		const user = await User.findOne({ userName: userName });
		if (!user) throw new Error("User doesn't exist");
		user.lastSeen = moment().tz("Asia/Kolkata").toDate();
		user.save();
		if (isHTTP) res.status(200).send({ status: true, user: user.userName });
		return;
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

export { signUp, signIn, updateLastSeen };
