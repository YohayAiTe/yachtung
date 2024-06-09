/** @extends {Powerup} */
class BorderPowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        this.game.borderInactiveTicks += CONFIG.powerups.effects.border.duration
    }

    endEffect() {}

    static get duration() { return 0 }

    /** @type {PowerupRenderFunc} */
    static render(ctx, x, y) {
        super.render(ctx, x, y)

        ctx.lineWidth = 0.003
        ctx.strokeStyle = "yellow"
        ctx.strokeRect(x - this.width/2, y - this.width/2, this.width, this.width)
    }
}
