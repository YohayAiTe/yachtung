/** @extends {Powerup} */
class BaseSpeedPowerup extends Powerup {

    /** @type {Boolean} */
    static doAffectSelf
    /** @type {number} */
    static multiplier

    constructor(game, player) {
        super(game, player)
        
        for (const player of this.game.players) {
            if ((player === this.player) === this.constructor.doAffectSelf) {
                player.velocity *= this.constructor.multiplier
            }
        }
    }

    endEffect() {
        for (const player of this.game.players) {
            if ((player === this.player) === this.constructor.doAffectSelf) {
                player.velocity /= this.constructor.multiplier
            }
        }
    }

    /** @returns {number} */
    static get duration() { return CONFIG.powerups.effects.speed.duration }

    static get baseColor() { return this.doAffectSelf ? "green" : "red" }

    /** @type {PowerupRenderFunc} */
    static render(ctx, x, y) {
        super.render(ctx, x, y)

        const arrowDirection = this.multiplier > 1 ? -1 : 1

        ctx.strokeStyle = "yellow"
        ctx.lineWidth = 0.003
        ctx.beginPath()
        ctx.moveTo(x - this.width*0.75, y)
        ctx.lineTo(x, y + this.width/2*arrowDirection)
        ctx.lineTo(x + this.width*.75, y)
        
        ctx.moveTo(x - this.width*0.75, y - 0.007 * arrowDirection)
        ctx.lineTo(x, y + this.width/2*arrowDirection - 0.007 * arrowDirection)
        ctx.lineTo(x + this.width*.75, y - 0.007 * arrowDirection)
        ctx.stroke()
    }
}


class SelfSpeedBoost extends BaseSpeedPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = true
    /** @type {number} */
    static multiplier = CONFIG.powerups.effects.speed.multiplier
}
class OtherSpeedBoost extends BaseSpeedPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = false
    /** @type {number} */
    static multiplier = CONFIG.powerups.effects.speed.multiplier
}
class SelfSpeedDeboost extends BaseSpeedPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = true
    /** @type {number} */
    static multiplier = 1 / CONFIG.powerups.effects.speed.multiplier
}
class OtherSpeedDeboost extends BaseSpeedPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = false
    /** @type {number} */
    static multiplier = 1 / CONFIG.powerups.effects.speed.multiplier
}
