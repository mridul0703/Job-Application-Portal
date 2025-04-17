const express = require("express");
const { config } = require("dotenv");
const connectDB = require("./config/mongoDB"); // no .js needed in CommonJS
const cors = require("cors");
const cookieParser = require("cookie-parser");


config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/apply', require('./routes/applicationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
