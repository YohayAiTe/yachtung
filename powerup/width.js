/** @extends {Powerup} */
class BaseWidthPowerup extends Powerup {

    /** @type {Boolean} */
    static doAffectSelf
    /** @type {number} */
    static multiplier

    constructor(game, player) {
        super(game, player)
        
        for (const player of this.game.players) {
            if ((player === this.player) === this.constructor.doAffectSelf) {
                player.width *= this.constructor.multiplier
            }
        }
    }

    endEffect() {
        for (const player of this.game.players) {
            if ((player === this.player) === this.constructor.doAffectSelf) {
                player.width /= this.constructor.multiplier
            }
        }
    }

    /** @returns {number} */
    static get duration() { return CONFIG.powerups.effects.width.duration }

    static get baseColor() { return this.doAffectSelf ? "green" : "red" }

    /** @type {PowerupRenderFunc} */
    static render(ctx, x, y) {
        super.render(ctx, x, y)

        const innerWidth = this.multiplier < 1 ? 0.67 : 1.5

        ctx.fillStyle = "yellow"
        ctx.beginPath()
        ctx.arc(x, y, Config.gameplay.powerups.width*innerWidth / 3, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}

class SelfWidthBoost extends BaseWidthPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = true
    /** @type {number} */
    static multiplier = CONFIG.powerups.effects.width.multiplier
}
class OtherWidthBoost extends BaseWidthPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = false
    /** @type {number} */
    static multiplier = CONFIG.powerups.effects.width.multiplier
}
class SelfWidthDeboost extends BaseWidthPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = true
    /** @type {number} */
    static multiplier = 1 / CONFIG.powerups.effects.width.multiplier
}
class OtherWidthDeboost extends BaseWidthPowerup {
    constructor(game, player) { super(game, player) }
    static doAffectSelf = false
    /** @type {number} */
    static multiplier = 1 / CONFIG.powerups.effects.width.multiplier
}
