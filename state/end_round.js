/**
 * 
 * @extends State
 */
class EndRound extends State {
    /** @type {Player|null} */
    #lastAlive = null

    constructor(game) {
        super(game, "end-round")

        for (const player of this.game.players) if (player.isAlive) this.#lastAlive = player

        const cfgScoring = CONFIG.gameplay.round.scoring
        /** @type {Player[]} */
        const sortedPlayers = this.game.players.toSorted((p1,  p2) => p2.score - p1.score)
        const topScore = sortedPlayers[0].score
        const minEndGameScores = (this.game.players.length-1)*cfgScoring.endGameFactor
        const topPlayersDifference = sortedPlayers[0].score - sortedPlayers[1].score
        if (minEndGameScores <= topScore && 
            topPlayersDifference >= cfgScoring.minPointsDifference) return new EndScreen(game)

        const cfgContinueKey = CONFIG.UI.controls.continueGameKeys[0]

        const continueGameMessageSpan = document.createElement("span")
        continueGameMessageSpan.innerText = `Press ${cfgContinueKey} to continue`
        continueGameMessageSpan.classList.add("continue-message")
        this.overlay.appendChild(continueGameMessageSpan)

        if (this.#lastAlive) {
            const roundWinnerSpan = document.createElement("span")
            roundWinnerSpan.innerText = `${this.#lastAlive.name} won the round`
            roundWinnerSpan.style.background = this.#lastAlive.pattern.cssGradient() + " text"
            roundWinnerSpan.classList.add("round-winner")
            this.overlay.appendChild(roundWinnerSpan)
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
