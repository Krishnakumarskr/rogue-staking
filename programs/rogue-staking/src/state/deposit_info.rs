use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct DepositInfo {
    pub user: Pubkey,
    pub amount: u64,
    pub last_deposit_amount: u64,
    pub last_deposit_timestamp: i64,
    pub last_withdraw_amount: u64,
    pub last_withdraw_timestamp: i64,
    pub bump: u8,
}
