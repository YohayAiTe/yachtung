/** @extends {Powerup} */
class KeyChangePowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        for (const player of this.game.players) {
            if (player !== this.player) player.keyDirections *= -1
        }
    }

    endEffect() {
        for (const player of this.game.players) {
            if (player !== this.player) player.keyDirections *= -1
        }
    }

    /** @returns {number} */
    static get duration() { return CONFIG.powerups.effects.keyChange.duration }

    static get baseColor() { return "red" }

    /** @type {PowerupRenderFunc} */
    static render(ctx, x, y) {
        super.render(ctx, x, y)

        ctx.lineWidth = 0.003
        ctx.strokeStyle = "yellow"
        ctx.beginPath()
        ctx.moveTo(x - this.width / 2, y - this.width / 2)
        ctx.lineTo(x - this.width * 0.75, y)
        ctx.lineTo(x - this.width / 2, y + this.width / 2)
        ctx.moveTo(x - this.width * 0.75, y)
        ctx.lineTo(x + this.width * 0.75, y)
        ctx.moveTo(x + this.width / 2, y - this.width / 2)
        ctx.lineTo(x + this.width * 0.75, y)
        ctx.lineTo(x + this.width / 2, y + this.width / 2)
        ctx.stroke()
    }
}
