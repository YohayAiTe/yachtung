/**
 * 
 * @extends State
 */
class EndRound extends State {
    /** @type {Player|null} */
    #lastAlive = null

    constructor(game) {
        super(game, "end-round")

        let topScore = 0
        for (const player of this.game.players) {
            if (player.isAlive) this.#lastAlive = player
            if (player.score > topScore) topScore = player.score
        }

        if ((this.game.players.length-1)*CONFIG.gameplay.round.scoring.endGameFactor <= topScore) return new EndScreen(game)

        const cfgContinueKey = CONFIG.UI.controls.continueGameKeys[0]

        const continueGameMessageSpan = document.createElement("span")
        continueGameMessageSpan.innerText = `Press ${cfgContinueKey} to continue`
        continueGameMessageSpan.classList.add("continue-message")
        this.game.overlay.appendChild(continueGameMessageSpan)

        if (this.#lastAlive) {
            const roundWinnerSpan = document.createElement("span")
            roundWinnerSpan.innerText = `${this.#lastAlive.name} won the round`
            roundWinnerSpan.style.background = this.#lastAlive.pattern.cssGradient() + " text"
            roundWinnerSpan.classList.add("round-winner")
            this.game.overlay.appendChild(roundWinnerSpan)
        }
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (this.game.isContinueKeyEvent(event)) this.game.setState(PreRound)
    }

    render() {
        this.game.renderBorder()
        this.game.renderObstacles()
        this.game.renderPlayers()
        this.game.powerupManager.render()
    }
}
