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

        if ((this.game.players.length-1)*CONFIG.gameplay.round.scoring.endGameFactor <= topScore) return new EndScreen(game)
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (this.game.isContinueKeyEvent(event)) this.game.setState(PreRound)
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()
        this.game.powerupManager.render()

        const cfgText = CONFIG.UI.text
        const cfgContinueKey = CONFIG.UI.controls.continueGameKeys[0]

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillStyle = cfgText.colour
        this.ctx.font = cfgText.font.large
        this.ctx.fillText(`Press ${cfgContinueKey} to continue`, 0.5, 0.5)
        if (this.#lastAlive) {
            this.ctx.fillStyle = this.#lastAlive.pattern.linearGradient(this.ctx, 0, 0.6, 1, 0.6)
            this.ctx.font = cfgText.font.medium
            this.ctx.fillText(`${this.#lastAlive.name} won the round`, 0.5, 0.6)
        }
    }
}
