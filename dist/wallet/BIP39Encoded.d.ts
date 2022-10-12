import { MnemonicObj } from "../interfaces";
export declare class BIP39Encoded {
    /**
     * The BIP39Encoded class will product a bip39 compliant mnemonic phrase in multiple formats
     * and facilitate format conversion.
     * @param mnemonic a pregenerated phonetic mnemonic phrase to encode into other formats. If this attribute is not provided, one
     * will be automatically generated.
     */
    private words;
    mnemonic: MnemonicObj;
    constructor(mnemonic?: string[] | undefined);
    generate(length?: number): MnemonicObj;
    bin2hex(b: string): string;
    hex2bin(h: string): string;
    decode(b58: string): MnemonicObj;
    encode(mnemonic: string[]): MnemonicObj;
}
