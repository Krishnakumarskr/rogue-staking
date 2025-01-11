import * as anchor from "@coral-xyz/anchor";
import { setup } from "./utils/setup";
import { getMint, pda, programMethods, requestTokens } from "./utils/utils";
import { assert } from "chai";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { errors } from "./utils/constants";

describe("rogue-staking", () => {
    const { owner, provider, program } = setup();
    let mint: anchor.web3.PublicKey;

    before(async () => {
        mint = await getMint(provider, owner);
        await programMethods.initializePlatformConfig(owner, mint);

        const amount = new anchor.BN(10e9);
        const userMintTokenAccount = (
            await getOrCreateAssociatedTokenAccount(
                provider.connection,
                owner,
                mint,
                owner.publicKey
            )
        ).address;
        await requestTokens(provider, owner, mint, userMintTokenAccount, amount.toNumber());
        await programMethods.deposit(provider, owner, mint, amount);
    });

    it("Withdrawing fails if amount is 0", async () => {
        const amount = new anchor.BN(0);

        try {
            await programMethods.withdraw(provider, owner, mint, amount);
        } catch (err) {
            const errorMessage = (err as anchor.AnchorError).error.errorMessage;
            assert.equal(errorMessage, errors.valueZero);
        }
    });

    it("Withdrawing fails if user does not have enough tokens deposited", async () => {
        const amount = new anchor.BN(100e9);

        try {
            await programMethods.withdraw(provider, owner, mint, amount);
        } catch (err) {
            const errorMessage = (err as anchor.AnchorError).error.errorMessage;
            assert.equal(errorMessage, errors.insufficientDeposit);
        }
    });

    it("Withdrawing succeeds", async () => {
        const amount = new anchor.BN(10e9);
        const depositInfo = pda.getDepositInfo(owner.publicKey);
        const userMintTokenAccountBalanceBeforeWithdrawal = Number(
            (
                await getOrCreateAssociatedTokenAccount(
                    provider.connection,
                    owner,
                    mint,
                    owner.publicKey
                )
            ).amount
        );
        await programMethods.withdraw(provider, owner, mint, amount);

        const userMintTokenAccountBalanceAfterWithdrawal = Number(
            (
                await getOrCreateAssociatedTokenAccount(
                    provider.connection,
                    owner,
                    mint,
                    owner.publicKey
                )
            ).amount
        );
        assert.equal(
            userMintTokenAccountBalanceAfterWithdrawal -
                userMintTokenAccountBalanceBeforeWithdrawal,
            amount.toNumber()
        );

        const depositInfoAccount = await program.account.depositInfo.fetch(depositInfo);
        assert.equal(depositInfoAccount.user.toString(), owner.publicKey.toString());
        assert.equal(depositInfoAccount.amount.toNumber(), 0);
        assert.equal(depositInfoAccount.lastWithdrawAmount.toNumber(), amount.toNumber());
        assert.isAbove(depositInfoAccount.lastWithdrawTimestamp.toNumber(), 0);
        assert(depositInfoAccount.bump >= 0 && depositInfoAccount.bump <= 255);
    });
});
