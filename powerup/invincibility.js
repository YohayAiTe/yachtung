/** @extends {Powerup} */
class InvincibilityPowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        this.player.invincibilityTicks = Config.gameplay.powerups.borderPowerupDuration
    }

    endEffect() {}

    static get width() { return Config.gameplay.powerups.width }

    static get duration() { return 0 }

    static get baseColor() { return "green" }

    /** @type {PowerupRenderFunc} */
    static render(ctx, x, y) {
        super.render(ctx, x, y)

        ctx.fillStyle = "yellow"
        ctx.beginPath()
        ctx.arc(x, y, Config.gameplay.powerups.width / 2, 0, 2*Math.PI, true)
        ctx.closePath()
        ctx.arc(x, y, Config.gameplay.powerups.width / 4, 0, 2*Math.PI, false)
        ctx.closePath()
        ctx.fill()
    }
}
