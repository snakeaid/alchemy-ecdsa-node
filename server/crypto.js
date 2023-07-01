"use strict";

const secp = require('ethereum-cryptography/secp256k1');
const { toHex, hexToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require("ethereum-cryptography/keccak");

const getPublicKey = (message, signature) => {
    const hash = hashMessage(message);
    const fullSignatureBytes = hexToBytes(signature);
    const recoveryBit = fullSignatureBytes[0];
    const signatureBytes = fullSignatureBytes.slice(1);

    return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
}

const getAddressFromPublicKey = (publicKey) => {
    const publicKeyBytes = publicKey.slice(1);
    const publicKeyHash = keccak256(publicKeyBytes);
    const publicKeyHashLength = publicKeyHash.length;
    const address = publicKeyHash.slice(publicKeyHashLength - 20);

    return toHex(address);
}

const getWalletAddress = (privateKey) => {
    const publicKey = secp.secp256k1.getPublicKey(privateKey);

    return getAddressFromPublicKey(publicKey);
}

const hashMessage = (message) => keccak256(Uint8Array.from(message));

const generatePrivateKey = () => secp.secp256k1.utils.randomPrivateKey();

module.exports = {
    getPublicKey,
    getAddressFromPublicKey
}