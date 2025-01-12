use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrors {
    #[msg("Value zero")]
    ValueZero,
    #[msg("Insufficient deposit")]
    InsufficientDeposit,
    #[msg("Deposits paused")]
    DepositsPaused,
    #[msg("Withdrawals paused")]
    WithdrawalsPaused,
}
