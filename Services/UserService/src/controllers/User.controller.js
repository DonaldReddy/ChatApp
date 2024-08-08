import User from "../models/User.schema.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";

// Sign up a new user
async function signUp(req, res) {
	try {
		const { userName, password, name } = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ userName });
		if (existingUser) throw new Error("User already exists");

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user instance
		const newUser = new User({
			userName,
			password: hashedPassword,
			name,
		});

		// Save the user to the database
		await newUser.save();

		res.status(200).send({ status: true, data: { user: newUser.userName } });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Sign in an existing user
async function signIn(req, res) {
	try {
		const { userName, password } = req.body;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User doesn't exist");

		// Compare the provided password with the stored hash
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new Error("Invalid credentials");

		// Update lastSeen timestamp
		await updateLastSeen(req, res, false);

		res.status(200).send({ status: true, data: { user: user.userName } });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Update lastSeen timestamp for a user
async function updateLastSeen(req, res, isHTTP = true) {
	try {
		const { userName } = req.body;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User doesn't exist");

		// Update lastSeen to the current time
		user.lastSeen = moment().tz("Asia/Kolkata").toDate();
		await user.save();

		if (isHTTP) {
			res.status(200).send({
				status: true,
				data: { user: user.userName, lastSeen: user.lastSeen },
			});
		}
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Get lastSeen timestamp for a user
async function getLastSeen(req, res) {
	try {
		const { userName } = req.query;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User doesn't exist");

		res.status(200).send({
			status: true,
			data: { user: user.userName, lastSeen: user.lastSeen },
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Add a friend for a user
async function addFriend(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Check if the user and friend are the same person
		if (userName === friendUserName)
			throw new Error("User cannot add themselves as a friend.");

		// Find the user and the friend by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const friend = await User.findOne({ userName: friendUserName });
		if (!friend) throw new Error("Friend does not exist.");

		// Check if the friend is already in the user's friend list
		if (user.friends.includes(friend._id)) {
			throw new Error("This user is already in your friend list.");
		}

		// Add each other as friends
		user.friends.push(friend._id);
		friend.friends.push(user._id);

		// Save both users' updated data
		await Promise.all([user.save(), friend.save()]);

		res
			.status(200)
			.send({ status: true, message: "Friend added successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Remove a friend for a user
async function removeFriend(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Check if the user and friend are the same person
		if (userName === friendUserName)
			throw new Error("User cannot remove themselves as a friend.");

		// Find the user and the friend by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const friend = await User.findOne({ userName: friendUserName });
		if (!friend) throw new Error("Friend does not exist.");

		// Check if the friend is in the user's friend list
		if (!user.friends.includes(friend._id)) {
			throw new Error("This user is not in your friend list.");
		}

		// Remove each other as friends
		user.friends.pull(friend._id);
		friend.friends.pull(user._id);

		// Save both users' updated data
		await Promise.all([user.save(), friend.save()]);

		res
			.status(200)
			.send({ status: true, message: "Friend removed successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Block a user for a user
async function blockUser(req, res) {
	try {
		const { userName, blockUserName } = req.body;

		// Check if the user and blockUser are the same person
		if (userName === blockUserName)
			throw new Error("User cannot block themselves.");

		// Find the user and the blockUser by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const blockUser = await User.findOne({ userName: blockUserName });
		if (!blockUser) throw new Error("User to be blocked does not exist.");

		// Check if the user is already blocked
		if (user.blockedUsers.includes(blockUser._id)) {
			throw new Error("This user is already blocked.");
		}

		// Block the user
		user.blockedUsers.push(blockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User blocked successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Unblock a user for a user
async function unblockUser(req, res) {
	try {
		const { userName, unblockUserName } = req.body;

		// Check if the user and unblockUser are the same person
		if (userName === unblockUserName)
			throw new Error("User cannot unblock themselves.");

		// Find the user and the unblockUser by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const unblockUser = await User.findOne({ userName: unblockUserName });
		if (!unblockUser) throw new Error("User to be unblocked does not exist.");

		// Check if the user is already unblocked
		if (!user.blockedUsers.includes(unblockUser._id)) {
			throw new Error("This user is not in your blocked list.");
		}

		// Unblock the user
		user.blockedUsers.pull(unblockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User unblocked successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Block a group for a user
async function blockGroup(req, res) {
	try {
		const { userName, blockUserName } = req.body;

		// Check if the user and blockUser are the same person
		if (userName === blockUserName)
			throw new Error("User cannot block themselves.");

		// Find the user and the blockUser by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const blockUser = await User.findOne({ userName: blockUserName });
		if (!blockUser) throw new Error("User to be blocked does not exist.");

		// Check if the user is already blocked
		if (user.blockedUsers.includes(blockUser._id)) {
			throw new Error("This user is already blocked.");
		}

		// Block the user
		user.blockedUsers.push(blockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User blocked successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Unblock a group for a user
async function unblockGroup(req, res) {
	try {
		const { userName, unblockUserName } = req.body;

		// Check if the user and unblockUser are the same person
		if (userName === unblockUserName)
			throw new Error("User cannot unblock themselves.");

		// Find the user and the unblockUser by userName
		const user = await User.findOne({ userName });
		if (!user) throw new Error("User does not exist.");

		const unblockUser = await User.findOne({ userName: unblockUserName });
		if (!unblockUser) throw new Error("User to be unblocked does not exist.");

		// Check if the user is already unblocked
		if (!user.blockedUsers.includes(unblockUser._id)) {
			throw new Error("This user is not in your blocked list.");
		}

		// Unblock the user
		user.blockedUsers.pull(unblockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User unblocked successfully." });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

export {
	signUp,
	signIn,
	updateLastSeen,
	getLastSeen,
	addFriend,
	removeFriend,
	blockUser,
	unblockUser,
};
