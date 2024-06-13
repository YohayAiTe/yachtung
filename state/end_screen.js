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
        super(game, "end-screen")

        this.#sortedPlayers = this.game.players.toSorted((p1, p2) => p2.score - p1.score)

        const topScore = this.#sortedPlayers[0].score
        this.#topAchievers = 0
        for (const player of this.#sortedPlayers) {
            if (player.score === topScore) this.#topAchievers++
            else break
        }

        const cfgContinueKey = CONFIG.UI.controls.continueGameKeys[0]

        const winnerMessageSpan = document.createElement("span")
        if (this.#topAchievers > 1) {
            winnerMessageSpan.innerText = `There are ${this.#topAchievers} winners!`
            winnerMessageSpan.classList.add("multiple-winners")
        } else {
            const winningPlayer = this.#sortedPlayers[0]
            winnerMessageSpan.innerText = `${winningPlayer.name} has won with ${winningPlayer.score} points!`
            winnerMessageSpan.style.background = winningPlayer.pattern.cssGradient() + " text"
            winnerMessageSpan.classList.add("single-winner")
        }
        this.game.overlay.appendChild(winnerMessageSpan)

        const continueMessageSpan = document.createElement("span")
        continueMessageSpan.innerText = `Press ${cfgContinueKey} to start again`
        continueMessageSpan.classList.add("continue")
        this.game.overlay.appendChild(continueMessageSpan)
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (this.game.isContinueKeyEvent(event)) this.game.setState(StartScreen)
    }

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()
    }
}
