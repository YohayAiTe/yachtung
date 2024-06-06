/** @extends {Powerup} */
class ClearBoardPowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        this.game.obstacles = []
        this.game.state.startTrail()
    }

    endEffect() {}

    static get width() { return Config.gameplay.powerups.width }

    static get duration() { return 0 }
}
