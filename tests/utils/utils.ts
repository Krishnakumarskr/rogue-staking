import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RogueStaking } from "../../target/types/rogue_staking";
import { createMint, mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { decimals, seeds } from "./constants";

const program = anchor.workspace.RogueStaking as Program<RogueStaking>;

const getMint = async (provider: anchor.AnchorProvider, owner: anchor.web3.Keypair) => {
    return await createMint(provider.connection, owner, owner.publicKey, owner.publicKey, decimals);
};

const requestTokens = async (
    provider: anchor.AnchorProvider,
    owner: anchor.web3.Keypair,
    mint: anchor.web3.PublicKey,
    to: anchor.web3.PublicKey,
    amount: number
) => {
    await mintTo(provider.connection, owner, mint, to, owner, amount);
};

const pda = {
    getPlatformConfig() {
        return anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from(seeds.platformConfig)],
            program.programId
        )[0];
    },
    getPlatformMintTokenAccount() {
        return anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from(seeds.platformMintTokenAccount)],
            program.programId
        )[0];
    },
    getDepositInfo(user: anchor.web3.PublicKey) {
        return anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from(seeds.depositInfo), user.toBuffer()],
            program.programId
        )[0];
    },
};

const programMethods = {
    async initializePlatformConfig(owner: anchor.web3.Keypair, mint: anchor.web3.PublicKey) {
        const admin = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();
        const platformMintTokenAccount = pda.getPlatformMintTokenAccount();

        await program.methods
            .initializePlatformConfig()
            .accounts({
                admin,
                mint,
                platformConfig,
                platformMintTokenAccount,
            })
            .signers([owner])
            .rpc();
    },
    async deposit(
        provider: anchor.AnchorProvider,
        owner: anchor.web3.Keypair,
        mint: anchor.web3.PublicKey,
        amount: anchor.BN
    ) {
        const user = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();
        const platformMintTokenAccount = pda.getPlatformMintTokenAccount();
        const userMintTokenAccount = (
            await getOrCreateAssociatedTokenAccount(
                provider.connection,
                owner,
                mint,
                owner.publicKey
            )
        ).address;
        const depositInfo = pda.getDepositInfo(owner.publicKey);

        await program.methods
            .deposit(amount)
            .accounts({
                user,
                mint,
                platformConfig,
                platformMintTokenAccount,
                userMintTokenAccount,
                depositInfo,
            })
            .signers([owner])
            .rpc();
    },
    async withdraw(
        provider: anchor.AnchorProvider,
        owner: anchor.web3.Keypair,
        mint: anchor.web3.PublicKey,
        amount: anchor.BN
    ) {
        const user = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();
        const platformMintTokenAccount = pda.getPlatformMintTokenAccount();
        const userMintTokenAccount = (
            await getOrCreateAssociatedTokenAccount(
                provider.connection,
                owner,
                mint,
                owner.publicKey
            )
        ).address;
        const depositInfo = pda.getDepositInfo(owner.publicKey);

        await program.methods
            .withdraw(amount)
            .accounts({
                user,
                mint,
                platformConfig,
                platformMintTokenAccount,
                userMintTokenAccount,
                depositInfo,
            })
            .signers([owner])
            .rpc();
    },
    async pauseDeposits(owner: anchor.web3.Keypair) {
        const admin = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();

        await program.methods
            .pauseDeposits()
            .accounts({
                admin,
                platformConfig,
            })
            .signers([owner])
            .rpc();
    },
    async pauseWithdrawals(owner: anchor.web3.Keypair) {
        const admin = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();

        await program.methods
            .pauseWithdrawals()
            .accounts({
                admin,
                platformConfig,
            })
            .signers([owner])
            .rpc();
    },
    async unpauseDeposits(owner: anchor.web3.Keypair) {
        const admin = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();

        await program.methods
            .unpauseDeposits()
            .accounts({
                admin,
                platformConfig,
            })
            .signers([owner])
            .rpc();
    },
    async unpauseWithdrawals(owner: anchor.web3.Keypair) {
        const admin = owner.publicKey;
        const platformConfig = pda.getPlatformConfig();

        await program.methods
            .unpauseWithdrawals()
            .accounts({
                admin,
                platformConfig,
            })
            .signers([owner])
            .rpc();
    },
};

export { getMint, requestTokens, pda, programMethods };
