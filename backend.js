const express = require("express");
const path = require("path");

const app = express();
const User = require("./userModal.js");

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added to handle JSON requests

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// GET Route - Render Form Page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/Dataentry", async (req, res) => {
  try {
    const { groupName, memberName, memberEmail } = req.body;

    if (!groupName || !memberName || !memberEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await User.create({
      groupName,
      memberName,
      memberEmail,
    });

    res.render("success");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.post("/search", async (req, res) => {
  try {
    const groupName = req.body.searchkey;
    const users = await User.find({ groupName });

    if (users.length === 0) {
      return res.render("search", { users: [], message: "No users found for this group." });
    }

    res.render("search", { users, message: null });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to handle deletion of a user by email
app.post("/delete-user", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const deletedUser = await User.findOneAndDelete({ memberEmail: email });

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start Server
app.listen(3000, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server running at http://localhost:3000");
  }
});
