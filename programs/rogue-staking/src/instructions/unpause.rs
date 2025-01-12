use anchor_lang::prelude::*;

use crate::{constants::*, PlatformConfig};

#[derive(Accounts)]
pub struct UnPause<'info> {
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

impl UnPause<'_> {
    pub fn unpause_deposits(ctx: &mut Context<UnPause>) -> Result<()> {
        ctx.accounts.platform_config.is_deposit_paused = false;

        Ok(())
    }

    pub fn unpause_withdrawals(ctx: &mut Context<UnPause>) -> Result<()> {
        ctx.accounts.platform_config.is_withdraw_paused = false;

        Ok(())
    }
}
