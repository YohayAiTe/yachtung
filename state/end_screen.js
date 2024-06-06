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
        if (event.code === Config.continueGameKey && event.type === "keyup") this.game.setState(StartScreen)
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder(1)
        this.game.renderObstacles()
        this.game.renderPlayers()

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.font = Config.text.font.large
        
        if (this.#topAchievers > 1) {
            this.ctx.fillStyle = Config.text.colour
            this.ctx.fillText(`There are ${this.#topAchievers} winners!`, 0.5, 0.5)
            this.ctx.font = Config.text.font.medium
            this.ctx.fillText(`Press ${Config.continueGameKey} to start again`, 0.5, 0.6)
        } else {
            const winningPlayer = this.#sortedPlayers[0]
            this.ctx.fillStyle = winningPlayer.colour
            this.ctx.fillText(`${winningPlayer.name} has won with ${winningPlayer.score} points!`, 0.5, 0.5)
            this.ctx.fillStyle = Config.text.colour
            this.ctx.font = Config.text.font.medium
            this.ctx.fillText(`Press ${Config.continueGameKey} to start again`, 0.5, 0.6)
        }
    }
}
