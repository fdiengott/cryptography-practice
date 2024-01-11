const express = require("express");
const db = require("./dbConfig");
const { signup, login } = require("./users");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const users = await db("users");
        res.json(users);
    } catch (err) {
        console.error(err);
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const data = await signup(username, password);

    if (data) {
        return res.json(data);
    }

    res.json({ message: "username taken" });
});

app.post("/login/", async (req, res) => {
    const { username, password } = req.body;

    const isSuccess = await login(username, password);

    if (isSuccess) {
        return res.status(201).json({ message: "logged in successfully" });
    }

    res.status(401).json({ message: "Wrong username or password" });
});

app.listen(PORT, () => {
    console.log(`Serving running on port ${PORT}`);
});
