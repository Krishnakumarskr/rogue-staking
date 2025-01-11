use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::{constants::*, PlatformConfig};

#[derive(Accounts)]
pub struct InitializePlatformConfig<'info> {
    /// The platform admin.
    #[account(mut)]
    pub admin: Signer<'info>,

    /// The token to be used for staking.
    #[account()]
    pub mint: Account<'info, Mint>,

    /// The global platform config.
    #[account(
        init,
        payer = admin,
        seeds = [seeds::PLATFORM_CONFIG],
        bump,
        space = general::ANCHOR_DISCRIMINATOR_LENGTH + PlatformConfig::INIT_SPACE
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    /// Vault to store deposited tokens.
    #[account(
        init,
        payer = admin,
        seeds = [seeds::PLATFORM_MINT_TOKEN_ACCOUNT],
        bump,
        token::mint = mint,
        token::authority = platform_mint_token_account,
    )]
    pub platform_mint_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl InitializePlatformConfig<'_> {
    pub fn initialize_platform_config(ctx: &mut Context<InitializePlatformConfig>) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;

        platform_config.admin = ctx.accounts.admin.key();
        platform_config.mint = ctx.accounts.mint.key();
        platform_config.bump = ctx.bumps.platform_config;
        platform_config.mint_token_account_bump = ctx.bumps.platform_mint_token_account;

        Ok(())
    }
}
