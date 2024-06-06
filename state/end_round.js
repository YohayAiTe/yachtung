/**
 * 
 * @extends State
 */
class EndRound extends State {
    /** @type {Player|null} */
    #lastAlive = null

    constructor(game) {
        super(game)

        let topScore = 0
        for (const player of this.game.players) {
            if (player.isAlive) this.#lastAlive = player
            if (player.score > topScore) topScore = player.score
        }

        if ((this.game.players.length-1)*Config.gameplay.endGameFactor <= topScore) return new EndScreen(game)
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (event.code === Config.continueGameKey && event.type === "keyup") this.game.setState(PreRound)
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        // TODO: render powerups from previous round
        this.game.renderBorder(1)
        this.game.renderObstacles()
        this.game.renderPlayers()

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillStyle = Config.text.colour
        this.ctx.font = Config.text.font.large
        this.ctx.fillText(`Press ${Config.continueGameKey} to continue`, 0.5, 0.5)
        if (this.#lastAlive) {
            this.ctx.fillStyle = this.#lastAlive.colour
            this.ctx.font = Config.text.font.medium
            this.ctx.fillText(`${this.#lastAlive.name} won the round`, 0.5, 0.6)
        }
    }
}
