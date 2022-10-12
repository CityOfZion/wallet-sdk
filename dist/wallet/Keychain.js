"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keychain = void 0;
const constants_1 = require("../constants");
const Key_1 = require("./Key");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const crypto_1 = __importDefault(require("crypto"));
class Keychain {
    constructor(platform, seed) {
        if (!(platform in constants_1.bip32MasterSeeds)) {
            throw new Error("requested chain is not supported");
        }
        else if (seed === undefined) {
            throw new Error("invalid seed");
        }
        this.platform = platform;
        this.seed = seed;
        this.masterKey = this.generateMasterKey();
    }
    generateChildKey(derivationPath) {
        let pathArray = derivationPath.split("/");
        if (pathArray[0] !== "m") {
            throw new Error("derivation path must be of format: m/x/x...");
        }
        pathArray = pathArray.slice(1);
        let childKey = this.masterKey;
        for (const stringIdx of pathArray) {
            let childIdx;
            if (stringIdx.slice(-1) === "'") {
                childIdx =
                    parseInt(stringIdx.slice(0, stringIdx.length - 1), 10) +
                        constants_1.bip32Accounts.firstHardenedChild;
            }
            else {
                childIdx = parseInt(stringIdx, 10);
            }
            childKey = this.newChildKey(childKey, childIdx);
        }
        return childKey;
    }
    /**
     * generates a bip32 compliant master key
     */
    generateMasterKey() {
        const hmac = crypto_1.default
            .createHmac("sha512", constants_1.bip32MasterSeeds[this.platform])
            .update(this.seed)
            .digest();
        return new Key_1.Key({
            childNumber: 0,
            chainCode: hmac.slice(32, hmac.length),
            key: hmac.slice(0, 32),
            fingerprint: Buffer.from((0x0).toString(16)),
            depth: 0,
            isPrivate: true,
        });
    }
    newChildKey(parentKey, childIdx) {
        const curve = constants_1.curves[this.platform];
        const hardenedChild = childIdx >= constants_1.bip32Accounts.firstHardenedChild;
        let data;
        if (hardenedChild) {
            data = Buffer.concat([Buffer.from("00", "hex"), parentKey.f.key]);
        }
        else {
            const pk = curve.keyFromPrivate(parentKey.f.key, "hex");
            data = Buffer.from(pk.getPublic().encodeCompressed());
        }
        const childIdBuffer = Buffer.from(childIdx.toString(16).padStart(8, "0"), "hex");
        data = Buffer.concat([data, childIdBuffer]);
        const intermediary = crypto_1.default
            .createHmac("sha512", parentKey.f.chainCode)
            .update(data)
            .digest();
        let newKey;
        if (parentKey.f.isPrivate) {
            const k1 = new bignumber_js_1.default(intermediary.slice(0, 32).toString("hex"), 16);
            const k2 = new bignumber_js_1.default(parentKey.f.key.toString("hex"), 16);
            const c = new bignumber_js_1.default(curve.n);
            const protoKey = k1.plus(k2).mod(c).toString(16);
            newKey = Buffer.from(protoKey.padStart(64, "0"), "hex");
        }
        else {
            throw new Error("only private keys are supported for keygen");
        }
        return new Key_1.Key({
            childNumber: childIdx,
            chainCode: intermediary.slice(32, intermediary.length),
            depth: parentKey.f.depth + 1,
            fingerprint: crypto_1.default.createHash("sha256").update(newKey).digest(),
            key: newKey,
            isPrivate: parentKey.f.isPrivate,
        });
    }
}
exports.Keychain = Keychain;
//# sourceMappingURL=Keychain.js.map