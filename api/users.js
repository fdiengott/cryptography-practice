const db = require("./dbConfig");
const { saltedHash, checkIfEqual, generateAccessToken } = require("./utils");

const signup = async (username, password) => {
    const saltedHashedPassword = saltedHash(password);

    try {
        const [id] = await db("users").insert({
            username,
            password: saltedHashedPassword,
        });

        const token = generateAccessToken({ username, id });

        return { id, message: "inserted successfully!", token };
    } catch (err) {
        console.error(err);
    }
};

const login = async (username, password) => {
    try {
        const user = await db
            .select("*")
            .from("users")
            .where("username", username)
            .first();

        const passwordsMatch = checkIfEqual(user.password, password);

        return passwordsMatch;
    } catch (err) {
        console.error(err);
    }
};

module.exports = { signup, login };
