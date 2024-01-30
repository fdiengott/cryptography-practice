require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

const db = require("./dbConfig");

const PORT = 4000;

app.use(express.json());

app.post("/token", async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    const token = await db("tokens").where({ token: refreshToken }).first();

    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }

            const accessToken = generateAccessToken({
                username: decoded.username,
            });
            res.json({ accessToken });
        },
    );
});

app.delete("/logout", async (req, res) => {
    const isSuccess = await db("tokens").del({ token: req.body.token });

    if (isSuccess) {
        return res.sendStatus(204);
    }

    return res.sendStatus(400);
});

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    });
};

app.listen(PORT, () => {
    console.log(`Serving running on port ${PORT}`);
});
