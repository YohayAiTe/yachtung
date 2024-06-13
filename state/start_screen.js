/**
 * 
 * @extends State
 */
class StartScreen extends State {

    /** @type {{player: Player, key: "left" | "right"}[]} */
    queuedPresses = []

    constructor(game) {
        super(game, "start-screen")
        this.game.scoreboard.hideScoreboard()
        this.game.borderInactiveTicks = 0

        const availablePlayers = CONFIG.UI.players.display.length

        this.game.overlay.style.gridTemplateRows = `repeat(${availablePlayers}, 1fr) 0.5fr 1.5fr`
        this.#recreatePlayerButtons()
        for (const player of this.game.players) player.score = 0
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (this.game.isContinueKeyEvent(event)) {
            if (this.queuedPresses.length > 0) return
            this.#startGame()
        }

        if (this.queuedPresses.length > 0 && event.type === "keyup") {
            const queuedPress = this.queuedPresses.shift()
            if (queuedPress.key === "left") {
                queuedPress.player.leftKey = event.code
            } else {
                queuedPress.player.rightKey = event.code
            }
            this.#showFirstQueuedPress()
        }
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder()
    }

    #recreatePlayerButtons() {
        this.game.overlay.innerHTML = ""
        {
            const addPlayerButton = document.createElement("button")
            addPlayerButton.innerText = "Add Player"
            addPlayerButton.className = "game-controls"
            addPlayerButton.style.gridColumn = "player-name"
            addPlayerButton.style.gridRow = "-2"
            this.game.overlay.appendChild(addPlayerButton)
            addPlayerButton.onmouseup = () => {
                if (this.queuedPresses.length === 0) this.addPlayer()
            }

            const startGameButton = document.createElement("button")
            startGameButton.innerText = "Start Game"
            startGameButton.className = "game-controls"
            startGameButton.style.gridColumn = "player-left-control / table-end"
            startGameButton.style.gridRow = "-2"
            this.game.overlay.appendChild(startGameButton)
            startGameButton.onmouseup = () => {
                if (this.queuedPresses.length === 0) this.#startGame()
            }
        }

        const players = this.game.players
        for (const player of players) {
            const playerRemoveButton = document.createElement("button")
            playerRemoveButton.innerText = "X"
            playerRemoveButton.className = "player-controls player-remove"
            playerRemoveButton.style.color = player.pattern.colourAt(0)
            this.game.overlay.appendChild(playerRemoveButton)
            playerRemoveButton.onmouseup = () => {
                players.splice(players.indexOf(player), 1)
                this.#recreatePlayerButtons()
            }
            
            const playerNameTextarea = document.createElement("textarea")
            playerNameTextarea.innerText = player.name
            playerNameTextarea.rows = 1
            playerNameTextarea.classList.add("player-name")
            playerNameTextarea.style.background = player.pattern.cssGradient() + " text"
            this.game.overlay.appendChild(playerNameTextarea)
            playerNameTextarea.onkeydown = e => e.stopPropagation()
            playerNameTextarea.onkeyup = e => {
                e.stopPropagation()
                if (e.key === "Enter") playerNameTextarea.blur()
            }
            playerNameTextarea.oninput = () => {
                player.name = playerNameTextarea.value
            }

            const playerLeftControlButton = document.createElement("button")
            playerLeftControlButton.innerText = player.leftKey
            playerLeftControlButton.className = "player-controls player-left-control"
            playerLeftControlButton.style.background = player.pattern.cssGradient(true) + " text"
            this.game.overlay.appendChild(playerLeftControlButton)
            playerLeftControlButton.onmouseup = () => {
                if (this.queuedPresses.length > 0) return
                player.leftKey = null
                this.queuedPresses.push({player: player, key: "left"})
                this.#showFirstQueuedPress()
            }

            const playerRightControlButton = document.createElement("button")
            playerRightControlButton.innerText = player.rightKey
            playerRightControlButton.className = "player-controls player-right-control"
            playerRightControlButton.style.background = player.pattern.cssGradient(false) + " text"
            this.game.overlay.appendChild(playerRightControlButton)
            playerRightControlButton.onmouseup = () => {
                if (this.queuedPresses.length > 0) return
                player.rightKey = null
                this.queuedPresses.push({player: player, key: "right"})
                this.#showFirstQueuedPress()
            }
        }
    }

    #showFirstQueuedPress() {
        const queuedPress = this.queuedPresses[0]
        if (!queuedPress) {
            this.#recreatePlayerButtons()
            return
        }

        if (queuedPress.key === "left") {
            queuedPress.player.leftKey = "Press Key"
        } else {
            queuedPress.player.rightKey = "Press Key"
        }
        this.#recreatePlayerButtons()
    }

    addPlayer() {
        const cfgPlayers = CONFIG.UI.players.display

        if (this.game.players.length >= cfgPlayers.length) return
        const takenNames = this.game.players.map(p => p.name)
        let idx = -1
        for (let i = 0; i < cfgPlayers.length; i++) {
            const name = cfgPlayers[i].name;
            if (takenNames.indexOf(name) < 0) {
                idx = i
                break
            }
        }

        const newPlayer = new Player(cfgPlayers[idx].name, cfgPlayers[idx].pattern, cfgPlayers[idx].invertedPattern)
        this.game.players.push(newPlayer)
        this.queuedPresses.push({player: newPlayer, key: "left"}, {player: newPlayer, key: "right"})
        this.#showFirstQueuedPress()
    }

    #startGame() {
        for (const player of this.game.players) player.gameReset()
        this.game.setState(PreRound)
    }
}
