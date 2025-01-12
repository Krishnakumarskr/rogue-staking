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
    });

    it("Can pause deposits", async () => {
        await programMethods.pauseDeposits(owner);

        const platformConfigAccount = await program.account.platformConfig.fetch(
            pda.getPlatformConfig()
        );

        assert.isTrue(platformConfigAccount.isDepositPaused);
    });

    it("Can pause withdrawals", async () => {
        await programMethods.pauseWithdrawals(owner);

        const platformConfigAccount = await program.account.platformConfig.fetch(
            pda.getPlatformConfig()
        );

        assert.isTrue(platformConfigAccount.isWithdrawPaused);
    });
});
