import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RogueStaking } from "../../target/types/rogue_staking";

export function setup() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const owner = (provider.wallet as anchor.Wallet).payer;

    const program = anchor.workspace.RogueStaking as Program<RogueStaking>;

    return {
        provider,
        owner,
        program,
    };
}
