import * as anchor from "@coral-xyz/anchor";
import { setup } from "./utils/setup";
import { getMint, pda, programMethods } from "./utils/utils";
import { assert } from "chai";

describe("rogue-staking", () => {
    const { owner, provider, program } = setup();
    let mint: anchor.web3.PublicKey;

    before(async () => {
        mint = await getMint(provider, owner);
        await programMethods.initializePlatformConfig(owner, mint);
        await programMethods.pauseDeposits(owner);
        await programMethods.pauseWithdrawals(owner);
    });

    it("Can unpause deposits", async () => {
        await programMethods.unpauseDeposits(owner);

        const platformConfigAccount = await program.account.platformConfig.fetch(
            pda.getPlatformConfig()
        );

        assert.isFalse(platformConfigAccount.isDepositPaused);
    });

    it("Can unpause withdrawals", async () => {
        await programMethods.unpauseWithdrawals(owner);

        const platformConfigAccount = await program.account.platformConfig.fetch(
            pda.getPlatformConfig()
        );

        assert.isFalse(platformConfigAccount.isWithdrawPaused);
    });
});
