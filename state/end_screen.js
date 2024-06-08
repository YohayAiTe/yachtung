/**
 * 
 * @extends State
 */
class EndScreen extends State {

    /** @type {Player[]} */
    #sortedPlayers

    /** @type {number} */
    #topAchievers

    constructor(game) {
        super(game)

        this.#sortedPlayers = this.game.players.toSorted((p1, p2) => p2.score - p1.score)

        const topScore = this.#sortedPlayers[0].score
        this.#topAchievers = 0
        for (const player of this.#sortedPlayers) {
            if (player.score === topScore) this.#topAchievers++
            else break
        }
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (this.game.isContinueKeyEvent(event)) this.game.setState(StartScreen)
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()

        const cfgText = CONFIG.UI.text
        const cfgContinueKey = CONFIG.UI.controls.continueGameKeys[0]

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = cfgText.font.large
        
        if (this.#topAchievers > 1) {
            this.ctx.fillStyle = cfgText.colour
            this.ctx.fillText(`There are ${this.#topAchievers} winners!`, 0.5, 0.5)
            this.ctx.font = cfgText.font.medium
            this.ctx.fillText(`Press ${cfgContinueKey} to start again`, 0.5, 0.6)
        } else {
            const winningPlayer = this.#sortedPlayers[0]
            this.ctx.fillStyle = winningPlayer.pattern.linearGradient(this.ctx, 0, 0.5, 1, 0.5)
            this.ctx.fillText(`${winningPlayer.name} has won with ${winningPlayer.score} points!`, 0.5, 0.5)
            this.ctx.fillStyle = cfgText.colour
            this.ctx.font = cfgText.font.medium
            this.ctx.fillText(`Press ${cfgContinueKey} to start again`, 0.5, 0.6)
        }
    }
}
