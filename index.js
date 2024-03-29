const readline = require("readline");
const {
    createHash,
    randomBytes,
    scryptSync,
    timingSafeEqual,
} = require("crypto");

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

// : a terminal interface to input passwords and have hashes outputted
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Input to hash: ", input1 => {
    const hashedInput = hash(input1);
    const saltedHashedInput = saltedHash(input1);

    console.log("simple hash", hashedInput);
    console.log("salted and hashed", saltedHashedInput);

    rl.question("Match input: ", input2 => {
        const [salt, key] = saltedHashedInput.split(":");

        const hashedBuffer = scryptSync(input2, salt, 64);
        const keyBuffer = Buffer.from(key, "base64");

        const match = timingSafeEqual(hashedBuffer, keyBuffer);

        console.log(match ? "passwords matched!" : "wrong password");

        rl.close();
    });
});
