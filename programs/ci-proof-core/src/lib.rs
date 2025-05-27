use anchor_lang::prelude::*;

declare_id!("EohAXa9vx1LKURX8zGwbWYcxtsUD167EhpEoQhVr8V2c");

#[program]
pub mod ci_proof_core {
    use super::*;

    pub fn say_hello(_ctx: Context<SayHello>) -> Result<()> {
        msg!("👋 Hello from CI Proof Core!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SayHello {}
