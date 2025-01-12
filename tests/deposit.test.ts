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
    });

    it("Depositing fails if amount is 0", async () => {
        const amount = new anchor.BN(0);

        try {
            await programMethods.deposit(provider, owner, mint, amount);
        } catch (err) {
            const errorMessage = (err as anchor.AnchorError).error.errorMessage;
            assert.equal(errorMessage, errors.valueZero);
        }
    });

    it("Depositing fails if user does not have enough tokens", async () => {
        const amount = new anchor.BN(10e9);

        try {
            await programMethods.deposit(provider, owner, mint, amount);
        } catch {}
    });

    it("Depositing succeeds", async () => {
        const amount = new anchor.BN(10e9);
        const userMintTokenAccount = (
            await getOrCreateAssociatedTokenAccount(
                provider.connection,
                owner,
                mint,
                owner.publicKey
            )
        ).address;
        const depositInfo = pda.getDepositInfo(owner.publicKey);
        await requestTokens(provider, owner, mint, userMintTokenAccount, amount.toNumber());
        const userMintTokenAccountBalanceBeforeDeposit = Number(
            (
                await getOrCreateAssociatedTokenAccount(
                    provider.connection,
                    owner,
                    mint,
                    owner.publicKey
                )
            ).amount
        );

        await programMethods.deposit(provider, owner, mint, amount);

        const depositInfoAccount = await program.account.depositInfo.fetch(depositInfo);
        assert.equal(depositInfoAccount.user.toString(), owner.publicKey.toString());
        assert.equal(depositInfoAccount.amount.toNumber(), amount.toNumber());
        assert.equal(depositInfoAccount.lastWithdrawAmount.toNumber(), 0);
        assert.equal(depositInfoAccount.lastWithdrawTimestamp.toNumber(), 0);
        assert(depositInfoAccount.bump >= 0 && depositInfoAccount.bump <= 255);

        const userMintTokenAccountBalanceAfterDeposit = Number(
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
            Number(userMintTokenAccountBalanceBeforeDeposit) -
                Number(userMintTokenAccountBalanceAfterDeposit),
            amount.toNumber()
        );
    });

    it("Depositing fails if deposits are paused", async () => {
        const amount = new anchor.BN(10e9);

        await programMethods.pauseDeposits(owner);

        try {
            await programMethods.deposit(provider, owner, mint, amount);
        } catch (err) {
            const errorMessage = (err as anchor.AnchorError).error.errorMessage;
            assert.equal(errorMessage, errors.depositsPaused);
        }
    });
});
