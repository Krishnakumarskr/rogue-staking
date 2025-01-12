use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

use crate::{constants::*, errors::*, DepositInfo, PlatformConfig};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    /// The withdrawer.
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
        mut,
        seeds = [seeds::DEPOSIT_INFO, user.key().as_ref()],
        bump = deposit_info.bump,
    )]
    pub deposit_info: Account<'info, DepositInfo>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl Withdraw<'_> {
    pub fn withdraw(ctx: &mut Context<Withdraw>, amount: u64) -> Result<()> {
        require!(
            !ctx.accounts.platform_config.is_withdraw_paused,
            CustomErrors::WithdrawalsPaused
        );

        let deposit_info = &mut ctx.accounts.deposit_info;

        require!(amount > 0, CustomErrors::ValueZero);
        require!(
            amount <= deposit_info.amount,
            CustomErrors::InsufficientDeposit
        );

        deposit_info.amount -= amount;

        let clock = Clock::get()?;
        let withdraw_timestamp = clock.unix_timestamp;

        deposit_info.last_withdraw_amount = amount;
        deposit_info.last_withdraw_timestamp = withdraw_timestamp;

        let platform_mint_token_account_seed = &[
            seeds::PLATFORM_MINT_TOKEN_ACCOUNT,
            &[ctx.accounts.platform_config.mint_token_account_bump],
        ];
        let platform_mint_token_account_signer = [&platform_mint_token_account_seed[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.platform_mint_token_account.to_account_info(),
                    to: ctx.accounts.user_mint_token_account.to_account_info(),
                    authority: ctx.accounts.platform_mint_token_account.to_account_info(),
                },
                &platform_mint_token_account_signer,
            ),
            amount,
        )?;

        Ok(())
    }
}
