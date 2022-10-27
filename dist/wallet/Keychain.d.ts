/// <reference types="node" />
import { Key } from "./Key";
import { Buffer } from "buffer";
export declare class Keychain {
    platform: string;
    private seed;
    private masterKey;
    constructor(platform: string, seed: Buffer);
    generateChildKey(derivationPath: string): Key;
    /**
     * generates a bip32 compliant master key
     */
    private generateMasterKey;
    private newChildKey;
}
