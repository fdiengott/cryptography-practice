require("dotenv").config();

const {
    createHash,
    randomBytes,
    scryptSync,
    timingSafeEqual,
} = require("crypto");

const jwt = require("jsonwebtoken");

// : basic hashing function. using the blake2s function optimized for 32-bit microprocessors.
// : wanted to try a different function than sha256, which I believe to be the standard
const hash = input => {
    return createHash("blake2s256").update(input).digest("base64");
};

// : adding a salt to a hash to give an added layer of security
// : normally the salt and hash would be stored in a database
const saltedHash = input => {
    const salt = randomBytes(16).toString("base64");

    const hashedPassword = scryptSync(input, salt, 64).toString("base64");

    return `${salt}:${hashedPassword}`;
};

const checkIfEqual = (hash, input) => {
    const [salt, key] = hash.split(":");

    const passwordBuffer = scryptSync(input, salt, 64);
    const keyBuffer = Buffer.from(key, "base64");

    const match = timingSafeEqual(passwordBuffer, keyBuffer);

    return match;
};

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = decoded;

        next();
    });
};

module.exports = {
    hash,
    saltedHash,
    checkIfEqual,
    generateAccessToken,
    authenticateToken,
};
