use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("3cvusCxiUv88YsuaDqNEVXYtPVbdmsqSRQRP2gc5riP4");

#[program]
pub mod rogue_staking {
    use super::*;

    /// Initializes the platform config, setting the admin, and the mint to accept for deposits.
    pub fn initialize_platform_config(mut ctx: Context<InitializePlatformConfig>) -> Result<()> {
        InitializePlatformConfig::initialize_platform_config(&mut ctx)?;

        Ok(())
    }

    /// Pauses deposits.
    pub fn pause_deposits(mut ctx: Context<Pause>) -> Result<()> {
        Pause::pause_deposits(&mut ctx)?;

        Ok(())
    }

    /// Pauses withdrawals.
    pub fn pause_withdrawals(mut ctx: Context<Pause>) -> Result<()> {
        Pause::pause_withdrawals(&mut ctx)?;

        Ok(())
    }

    /// UnPauses deposits.
    pub fn unpause_deposits(mut ctx: Context<UnPause>) -> Result<()> {
        UnPause::unpause_deposits(&mut ctx)?;

        Ok(())
    }

    /// UnPauses withdrawals.
    pub fn unpause_withdrawals(mut ctx: Context<UnPause>) -> Result<()> {
        UnPause::unpause_withdrawals(&mut ctx)?;

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
