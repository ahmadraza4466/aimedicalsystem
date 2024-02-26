require("dotenv").config();
const express = require("express");
const ChatRoutes = require("./routes/chats");

const app = express();
app.use(express.json());

app.use("/chat", ChatRoutes);

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Sample Questions
// 1. What are the Qualifications for the appointment of the Federal Proseautor General
// 2. Tell me something about The Federal Prosecution Service, Act, 2023
// 3. What are the Duties of prosecutors?
