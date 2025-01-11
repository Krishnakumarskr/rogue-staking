use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("73iU3kEfpJQhCpLaFBMAaYDVwSM5RHwhWqHBW6XGDYU1");

#[program]
pub mod rogue_staking {
    use super::*;

    /// Initializes the platform config, setting the admin, and the mint to accept for deposits.
    pub fn initialize_platform_config(mut ctx: Context<InitializePlatformConfig>) -> Result<()> {
        InitializePlatformConfig::initialize_platform_config(&mut ctx)?;

        Ok(())
    }

    /// Allows anyone to deposit tokens for staking.
    ///
    /// # Arguments
    ///
    /// * `amount` - The amount of tokens to deposit for staking.
    pub fn deposit(mut ctx: Context<Deposit>, amount: u64) -> Result<()> {
        Deposit::deposit(&mut ctx, amount)?;

        Ok(())
    }

    /// Allows anyone with a valid deposit to unstake.
    ///
    /// # Arguments
    ///
    /// * `amount` - The amount of tokens to withdraw.
    pub fn withdraw(mut ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        Withdraw::withdraw(&mut ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
