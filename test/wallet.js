const sdk = require("../dist")
const assert = require("assert")

describe("A set of tests for the encoded wallet features", function() {

    it("should generate a new bip39 wallet", async() => {
        const wallet = new sdk.BIP39Encoded()
        assert(wallet.mnemonic.phonetic.length === 12)
        assert(wallet.mnemonic.buffer.length === 18)
        assert(wallet.mnemonic.binary.length === 144)
        assert(wallet.mnemonic.base58.length === 25)
    })

    it("should generate a new bip39 wallet with 24 words", async() => {
        const wallet = new sdk.BIP39Encoded({
            length: 24
        })
        assert(wallet.mnemonic.phonetic.length === 24)
        assert(wallet.mnemonic.buffer.length === 36)
        assert(wallet.mnemonic.binary.length === 288)
        assert(wallet.mnemonic.base58.length === 49)
    })

    it("should import an existing phonetic mnemonic phrase", async() => {
        const wallet = new sdk.BIP39Encoded()
        const walletNew = new sdk.BIP39Encoded({
            mnemonic: wallet.mnemonic.phonetic
        })
        assert(wallet.mnemonic.buffer === walletNew.mnemonic.buffer)
    })

    it("should import an existing hex mnemonic", async() => {
        const wallet = new sdk.BIP39Encoded()
        const walletNew = new sdk.BIP39Encoded({
            mnemonic: wallet.mnemonic.hex
        })
        assert(wallet.mnemonic.buffer === walletNew.mnemonic.buffer)
    })

    it("should import an existing base58 mnemonic", async() => {
        const wallet = new sdk.BIP39Encoded()
        const walletNew = new sdk.BIP39Encoded({
            mnemonic: wallet.mnemonic.base58
        })
        assert(wallet.mnemonic.buffer === walletNew.mnemonic.buffer)
    })
})