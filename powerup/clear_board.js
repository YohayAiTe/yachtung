/** @extends {Powerup} */
class ClearBoardPowerup extends Powerup {

    constructor(game, player) {
        super(game, player)
        
        this.game.obstacles = []
        for (const player of this.game.players) this.game.recreatePlayerObstacle(player)
    }

    endEffect() {}

    static get duration() { return 0 }
}
