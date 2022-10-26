import { bip32Accounts, bip32MasterSeeds, curves } from "../constants";
import { Key } from "./Key";
import BN from "bignumber.js";
import crypto from "crypto";
import { Buffer } from "buffer";

export class Keychain {
  public platform: string;
  private seed: Buffer;
  private masterKey: Key;

  constructor(platform: string, seed: Buffer) {
    if (!(platform in bip32MasterSeeds)) {
      throw new Error("requested chain is not supported");
    } else if (seed === undefined) {
      throw new Error("invalid seed");
    }

    this.platform = platform;
    this.seed = seed;
    this.masterKey = this.generateMasterKey();
  }

  generateChildKey(derivationPath: string): Key {
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
          bip32Accounts.firstHardenedChild;
      } else {
        childIdx = parseInt(stringIdx, 10);
      }
      childKey = this.newChildKey(childKey, childIdx);
    }
    return childKey;
  }

  /**
   * generates a bip32 compliant master key
   */
  private generateMasterKey(): Key {
    const hmac = crypto
      .createHmac("sha512", bip32MasterSeeds[this.platform])
      .update(this.seed)
      .digest();

    return new Key({
      childNumber: 0,
      chainCode: hmac.slice(32, hmac.length),
      key: hmac.slice(0, 32),
      fingerprint: Buffer.from((0x0).toString(16)),
      depth: 0,
      isPrivate: true,
    });
  }

  private newChildKey(parentKey: Key, childIdx: number): Key {
    const curve = curves[this.platform];

    const hardenedChild = childIdx >= bip32Accounts.firstHardenedChild;
    let data;
    if (hardenedChild) {
      data = Buffer.concat([Buffer.from("00", "hex"), parentKey.f.key]);
    } else {
      const pk = curve.keyFromPrivate(parentKey.f.key, "hex");
      data = Buffer.from(pk.getPublic().encodeCompressed());
    }
    const childIdBuffer = Buffer.from(
      childIdx.toString(16).padStart(8, "0"),
      "hex"
    );
    data = Buffer.concat([data, childIdBuffer]);
    const intermediary = crypto
      .createHmac("sha512", parentKey.f.chainCode)
      .update(data)
      .digest();

    let newKey;
    if (parentKey.f.isPrivate) {
      const k1 = new BN(intermediary.slice(0, 32).toString("hex"), 16);
      const k2 = new BN(parentKey.f.key.toString("hex"), 16);
      const c = new BN(curve.n);
      const protoKey = k1.plus(k2).mod(c).toString(16);

      newKey = Buffer.from(protoKey.padStart(64, "0"), "hex");
    } else {
      throw new Error("only private keys are supported for keygen");
    }

    return new Key({
      childNumber: childIdx,
      chainCode: intermediary.slice(32, intermediary.length),
      depth: parentKey.f.depth + 1,
      fingerprint: crypto.createHash("sha256").update(newKey).digest(),
      key: newKey,
      isPrivate: parentKey.f.isPrivate,
    });
  }
}
