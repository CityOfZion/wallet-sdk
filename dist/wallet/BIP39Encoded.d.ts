/// <reference types="node" />
import { BIP39Options, MnemonicObj } from "../interfaces";
import { Keychain } from "./Keychain";
import { Buffer } from "buffer";
export declare class BIP39Encoded {
    /**
     * The BIP39Encoded class will product a bip39 compliant mnemonic phrase in multiple formats
     * and facilitate format conversion.
     * @param mnemonic a pregenerated phonetic mnemonic phrase to encode into other formats. If this attribute is not provided, one
     * will be automatically generated.
     */
    private words;
    mnemonic: MnemonicObj;
    seed: Buffer;
    secret: string;
    constructor(options?: BIP39Options);
    generateMnemonic(options: BIP39Options): MnemonicObj;
    generateSeed(secret?: string): Buffer;
    bin2hex(b: string): string;
    hex2bin(h: string): string;
    decodeb58(b58: string): MnemonicObj;
    decodehex(hex: string): MnemonicObj;
    encode(mnemonic: string[]): MnemonicObj;
    getKeychain(platform: string): Keychain;
}
