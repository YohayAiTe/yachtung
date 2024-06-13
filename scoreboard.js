class Scoreboard {
    /**
     * 
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container
    }

    hideScoreboard() { this.container.style.display = "none" }
    showScoreboard() { this.container.style.display = "block" }

    /**
     * 
     * @param {Player[]} players 
     * @param {number} justDied 
     */
    updateScores(players, justDied) {
        this.container.innerHTML = ""

        for (const player of players) if (player.isAlive) player.score += justDied

        for (const player of players.toSorted((p1, p2) => p2.score - p1.score)) {
            const playerContainer = document.createElement("div")
            const playerElement = document.createElement("span")
            const scoreElement = document.createElement("span")

            playerContainer.classList.add("player-container")
            playerElement.classList.add("player-name")
            playerElement.style.background = player.pattern.cssGradient() + " text"
            playerElement.innerText = player.name
            scoreElement.classList.add("player-score")
            scoreElement.innerText = player.score.toString()

            if (player.isAlive) {
                playerContainer.appendChild(playerElement)
            } else {
                const deadStrikeThrough = document.createElement("span")
                deadStrikeThrough.style.backgroundImage = player.pattern.cssGradient()
                deadStrikeThrough.classList.add("dead-player")
                deadStrikeThrough.appendChild(playerElement)
                playerContainer.appendChild(deadStrikeThrough)
            }
            playerContainer.appendChild(scoreElement)
            this.container.appendChild(playerContainer)
        }
    }
}