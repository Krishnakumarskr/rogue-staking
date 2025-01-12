use anchor_lang::prelude::*;

use crate::{constants::*, PlatformConfig};

#[derive(Accounts)]
pub struct Pause<'info> {
    /// The platform admin.
    #[account(
        mut,
        address = platform_config.admin
    )]
    pub admin: Signer<'info>,

    /// The global platform config.
    #[account(
        mut,
        seeds = [seeds::PLATFORM_CONFIG],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,
}

impl Pause<'_> {
    pub fn pause_deposits(ctx: &mut Context<Pause>) -> Result<()> {
        ctx.accounts.platform_config.is_deposit_paused = true;

        Ok(())
    }

    pub fn pause_withdrawals(ctx: &mut Context<Pause>) -> Result<()> {
        ctx.accounts.platform_config.is_withdraw_paused = true;

        Ok(())
    }
}
