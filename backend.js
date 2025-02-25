const express = require("express");
const path = require("path");

const app = express();
const User = require("./userModal.js");

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

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
    // Extract values properly
    const { groupName, memberName, memberEmail } = req.body;

    // Ensure values are not undefined
    if (!groupName || !memberName || !memberEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create user entry in database
    await User.create({
      groupName,
      memberName,
      memberEmail,
    });

    // Render success page after successful entry
    res.render("success");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


app.post("/search", async (req, res) => {
  try {
      const groupName = req.body.searchkey;
      const users = await User.find({ groupName: groupName });

      if (users.length === 0) {
          return res.render("search", { users: [], message: "No users found for this group." });
      }

      res.render("search", { users, message: null });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
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
