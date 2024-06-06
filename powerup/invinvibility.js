/** @extends {Powerup} */
class InvincibilityPowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        this.player.invincibilityCount++
    }

    endEffect() {
        this.player.invincibilityCount--
    }

    static get width() { return Config.gameplay.powerups.width }

    static get duration() { return Config.gameplay.powerups.borderPowerupDuration }

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
