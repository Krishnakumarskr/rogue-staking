use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub mint: Pubkey,
    pub is_deposit_paused: bool,
    pub is_withdraw_paused: bool,
    pub bump: u8,
    pub mint_token_account_bump: u8,
}
