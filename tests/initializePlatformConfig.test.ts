import * as anchor from "@coral-xyz/anchor";
import { setup } from "./utils/setup";
import { getMint, pda, programMethods } from "./utils/utils";
import { assert } from "chai";

describe("rogue-staking", () => {
    const { owner, provider, program } = setup();
    let mint: anchor.web3.PublicKey;

    before(async () => {
        mint = await getMint(provider, owner);
    });

    it("Is initialized successfully", async () => {
        await programMethods.initializePlatformConfig(owner, mint);

        const platformConfigAccount = await program.account.platformConfig.fetch(
            pda.getPlatformConfig()
        );
        assert.equal(platformConfigAccount.admin.toString(), owner.publicKey.toString());
        assert.equal(platformConfigAccount.mint.toString(), mint.toString());
        assert(platformConfigAccount.bump >= 0 && platformConfigAccount.bump <= 255);
        assert(
            platformConfigAccount.mintTokenAccountBump >= 0 &&
                platformConfigAccount.mintTokenAccountBump <= 255
        );
    });
});
