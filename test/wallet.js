const sdk = require("../dist")

describe("A set of tests for the encoded wallet features", function() {

    it("should generate a new bip39 wallet", async() => {
        const wallet = new sdk.BIP39Encoded()
    })

    it("should generate a new bip39 wallet with 24 words", async() => {
        const wallet = new sdk.BIP39Encoded()
        wallet.generate(24)
    })

    it("should import an existing phonetic mnemonic phrase", async() => {
        const wallet = new sdk.BIP39Encoded()
        const walletNew = new sdk.BIP39Encoded(wallet.mnemonic.phonetic)
    })

})