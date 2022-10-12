/// <reference types="node" />
export interface MnemonicObj {
    phonetic: string[];
    binary: string;
    buffer: Buffer;
    indices: number[];
    base58: string;
    hex: string;
}
