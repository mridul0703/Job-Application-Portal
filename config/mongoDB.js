const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO);
		console.log(" Mongo DB connected");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

module.exports = connectDB;