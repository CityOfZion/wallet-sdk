/// <reference types="node" />
export interface BIP39Options {
    mnemonic?: string | string[];
    length?: number;
    secret?: string;
}
export interface KeyFields {
    childNumber: number;
    chainCode: Buffer;
    key: Buffer;
    fingerprint: Buffer;
    depth: number;
    isPrivate: boolean;
}
export interface MnemonicObj {
    phonetic: string[];
    binary: string;
    buffer: Buffer;
    indices: number[];
    base58: string;
    hex: string;
}
