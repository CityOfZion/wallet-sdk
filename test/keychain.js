const sdk = require("../dist")
const assert = require("assert")

describe("A set of tests for the keychain features", function() {

    it("should generate a new encoded bip39 wallet and generate private keys for both N3 and Flow blockchains", async() => {
        const wallet = new sdk.BIP39Encoded()
        console.log(`Encoded BIP39: ${wallet.mnemonic.base58}`)

        const n3Keychain = wallet.getKeychain("neo")
        //generate the first key on N3
        const N3Key = n3Keychain.generateChildKey("m/44'/888'/0'/0/0")

        const flowKeychain = wallet.getKeychain("flow")
        //generate the first key on flow
        const FlowKey = flowKeychain.generateChildKey("m/44'/539'/0'/0/0")

        console.log(N3Key.getWIF())
        console.log(FlowKey.getWIF())
    })

})