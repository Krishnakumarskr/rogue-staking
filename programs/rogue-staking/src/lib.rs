use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("73iU3kEfpJQhCpLaFBMAaYDVwSM5RHwhWqHBW6XGDYU1");

#[program]
pub mod rogue_staking {
    use super::*;

    pub fn initialize_platform_config(
        ctx: Context<Initialize>,
        // platform_config_init_params: PlatformConfigInitParams,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
