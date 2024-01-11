const express = require("express");
const db = require("./dbConfig");

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

app.post("/users", async (req, res) => {
    const { username, password } = req.body;

    try {
        await db("users").insert({ username, password });

        res.json({ message: "inserted successfully!" });
    } catch (err) {
        console.error(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving running on port ${PORT}`);
});
