"use strict";

import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

export const getWalletAddress = (privateKey) => {
    const publicKey = secp.getPublicKey(privateKey);
    const publicKeyBytes = publicKey.slice(1);
    const publicKeyHash = keccak256(publicKeyBytes);
    const publicKeyHashLength = publicKeyHash.length;
    const address = publicKeyHash.slice(publicKeyHashLength - 20);

    return address;
}

export const sign = async (message, privateKey) => {
    const hash = hashMessage(message);
    const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
        recovered: true,
    });
    const fullSignature = new Uint8Array([recoveryBit, ...signature]);

    return toHex(fullSignature);
};

const hashMessage = (message) => keccak256(Uint8Array.from(message));