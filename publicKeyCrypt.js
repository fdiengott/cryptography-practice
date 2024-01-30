const fs = require('fs');
const crypto = require('crypto');

// I'm going to use node's crypto to create public private keys
// but if I instead wanted to use openssl here and write to a file here is how i would do it

/*
 * $ openssl genrsa -out private_key.pem 4096
 * $ openssl rsa -pubout -in private_key.pem -out public_key.pem
 */

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
});

export const encryptText = (txt) => {
	return crypto.publicEncrypt({
		key: publicKey, // if file: fs.readFileSync('./public_key.pem', 'utf8')
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: 'sha256',
	},
		Buffer.from(txt)
	);
};

export const decryptText = txt => {
	return crypto.privateDecrypt({
		key: privateKey, // if file: fs.readFileSync('./private_key.pem', 'utf8')
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: 'sha256',
	},
		txt
	);
};

// my understanding of a strong cryptographic handshake (this might not be correct with rsa)
// is to have two entities, Alice and Bob, who each have their own public and private keys.
// If Alice wants something from bob, she first requests it, then Bob, encrypts the data 
// first with his own private key, and then with Alice's public key. This way, no one can 
// meaningfully intercept the packet because that would require Alice's private key. 
// Then the message can be decrypted using Bob's public key, which would authenticate that 
// the message actually came from Bob
