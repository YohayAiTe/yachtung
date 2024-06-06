class Scoreboard {
    /**
     * 
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container
    }

    hideScoreboard() { this.container.hidden = true }
    showScoreboard() { this.container.hidden = false }

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
            const playerElement = document.createElement(player.isAlive ? "span" : "s")
            const scoreElement = document.createElement("span")

            playerContainer.classList.add("player-container")
            playerElement.classList.add("player-name")
            playerElement.style.color = player.colour
            playerElement.innerText = player.name
            if (player.isAlive)
            scoreElement.classList.add("player-score")
            scoreElement.innerText = player.score.toString()

            playerContainer.appendChild(playerElement)
            playerContainer.appendChild(scoreElement)
            this.container.appendChild(playerContainer)
        }
    }
}