use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{constants::*, platform_config, PlatformConfig};

#[derive(Accounts)]
pub struct InitializePlatformConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account()]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = admin,
        seeds = [seeds::PLATFORM_CONFIG],
        bump,
        space = general::ANCHOR_DISCRIMINATOR_LENGTH + PlatformConfig::INIT_SPACE
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    pub system_program: Program<'info, System>,
}

impl InitializePlatformConfig<'_> {
    pub fn initialize_platform_config(ctx: &mut Context<InitializePlatformConfig>) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;

        platform_config.admin = ctx.accounts.admin.key();
        platform_config.mint = ctx.accounts.mint.key();
        platform_config.bump = ctx.bumps.platform_config;

        Ok(())
    }
}
