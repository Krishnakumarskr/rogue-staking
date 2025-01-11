use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
    pub mint_token_account_bump: u8,
}
