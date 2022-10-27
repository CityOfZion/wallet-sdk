"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const bs58_1 = __importDefault(require("bs58"));
const crypto_1 = __importDefault(require("crypto"));
class Key {
    constructor(fields) {
        this.f = fields;
    }
    getWIF() {
        const wif = Buffer.concat([
            Buffer.from("80", "hex"),
            this.f.key,
            Buffer.from("01", "hex"),
        ]);
        const sha256H = crypto_1.default.createHash("sha256").update(wif).digest();
        const sha256H2 = crypto_1.default.createHash("sha256").update(sha256H).digest();
        return bs58_1.default.encode(Buffer.concat([wif, sha256H2.slice(0, 4)]));
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map