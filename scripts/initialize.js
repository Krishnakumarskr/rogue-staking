const anchor = require("@coral-xyz/anchor");
const { Program, AnchorProvider } = require("@coral-xyz/anchor");

const {
    PublicKey,
    Transaction,
    Keypair,
    Connection,
    sendAndConfirmTransaction,
} = require("@solana/web3.js");

const IDL = require("../target/idl/rogue_staking.json");
const CONTRACT_ADDRESS = "73iU3kEfpJQhCpLaFBMAaYDVwSM5RHwhWqHBW6XGDYU1";
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const programId = new PublicKey(CONTRACT_ADDRESS);
const seed = require("/home/sahil/.config/solana/id.json");
const privateKeyBuffer = Buffer.from(seed);
let wallet = Keypair.fromSecretKey(privateKeyBuffer);
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(IDL, programId, provider);

const wsolMint = new anchor.web3.PublicKey("So11111111111111111111111111111111111111112");
const seeds = {
    platformConfig: "platform_config",
    platformMintTokenAccount: "platform_mint_token_account",
    depositInfo: "deposit_info",
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
    getDepositInfo(user) {
        return anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from(seeds.depositInfo), user.toBuffer()],
            program.programId
        )[0];
    },
};

const initializePlatformConfig = async () => {
    const platformConfig = pda.getPlatformConfig();
    const platformMintTokenAccount = pda.getPlatformMintTokenAccount();

    console.log("Initializing program...\n");

    const ix = await program.methods
        .initializePlatformConfig()
        .accounts({
            admin: wallet.publicKey,
            platformConfig,
            mint: wsolMint,
            platformMintTokenAccount,
        })
        .signers([wallet])
        .instruction();

    const tx = new Transaction().add(ix);
    await sendAndConfirmTransaction(provider.connection, tx, [wallet]);

    const platformConfigAccount = await program.account.platformConfig.fetch(platformConfig);

    console.log("Program initialized successfully...");
    console.log("Platform admin: ", platformConfigAccount.admin.toString());
    console.log("Staking token: ", platformConfigAccount.mint.toString());
};

initializePlatformConfig();
