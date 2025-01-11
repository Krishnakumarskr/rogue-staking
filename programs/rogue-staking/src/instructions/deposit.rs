use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

use crate::{constants::*, DepositInfo, PlatformConfig};

#[derive(Accounts)]
pub struct Deposit<'info> {
    /// The depositer.
    #[account(mut)]
    pub user: Signer<'info>,

    /// The token to be used for staking.
    #[account(
        address = platform_config.mint
    )]
    pub mint: Account<'info, Mint>,

    /// The global platform config.
    #[account(
        seeds = [seeds::PLATFORM_CONFIG],
        bump = platform_config.bump,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    /// Vault to store deposited tokens.
    #[account(
        mut,
        seeds = [seeds::PLATFORM_MINT_TOKEN_ACCOUNT],
        bump = platform_config.mint_token_account_bump,
        token::mint = mint,
        token::authority = platform_mint_token_account,
    )]
    pub platform_mint_token_account: Account<'info, TokenAccount>,

    /// User's token account to use for deposit.
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    pub user_mint_token_account: Account<'info, TokenAccount>,

    /// The user's deposit info.
    #[account(
        init_if_needed,
        payer = user,
        seeds = [seeds::DEPOSIT_INFO, user.key().as_ref()],
        bump,
        space = general::ANCHOR_DISCRIMINATOR_LENGTH + PlatformConfig::INIT_SPACE
    )]
    pub deposit_info: Account<'info, DepositInfo>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl Deposit<'_> {
    pub fn deposit(ctx: &mut Context<Deposit>, amount: u64) -> Result<()> {
        let deposit_info = &mut ctx.accounts.deposit_info;

        if deposit_info.user == Pubkey::default() {
            deposit_info.user = ctx.accounts.user.key();
            deposit_info.bump = ctx.bumps.deposit_info;
        }

        deposit_info.amount += amount;

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_mint_token_account.to_account_info(),
                    to: ctx.accounts.platform_mint_token_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }
}
