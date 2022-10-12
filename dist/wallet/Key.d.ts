import { KeyFields } from "../interfaces";
export declare class Key {
    f: KeyFields;
    constructor(fields: KeyFields);
    getWIF(): string;
}
