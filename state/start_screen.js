/**
 * 
 * @extends State
 */
class StartScreen extends State {

    /** @type {Button[]} */
    buttons

    /** @type {{player: Player, key: "left" | "right"}[]} */
    queuedPresses = []

    constructor(game) {
        super(game)
        this.game.scoreboard.hideScoreboard()
        this.game.borderInactiveTicks = 0

        const cfgText = CONFIG.UI.text

        this.buttons = [new Button(this.ctx, "Add Player", 0.33, 0.85, 
                cfgText.colour, cfgText.font.medium, "center", "middle",
                this.addPlayer.bind(this)),
            new Button(this.ctx, "Start Game", 0.67, 0.85, 
                cfgText.colour, cfgText.font.medium, "center", "middle",
                this.#startGame.bind(this))]
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
    mouseHandler(_, x, y) {
        if (this.queuedPresses.length > 0) return

        for (const button of this.buttons) button.testClick(x, y)
    }

    render() {
        this.game.renderBorder()

        for (const button of this.buttons) button.render()
        // SelfWidthBoost.render(this.ctx, 0.5, 0.5)
    }

    #recreatePlayerButtons() {
        const players = this.game.players
        this.buttons = this.buttons.slice(0, 2)

        const cfgText = CONFIG.UI.text

        for (const [idx, player] of players.entries()) {
            const y = 0.13+0.07*idx
            const colour = player.pattern.linearGradient(this.ctx, 0, y, 1, y)

            this.buttons.push(
                new Button(this.ctx, "X", 0.1, y, 
                    colour, cfgText.font.small, "left", "middle", 
                    () => {
                        players.splice(players.indexOf(player), 1)
                        this.#recreatePlayerButtons()
                    }),
                new Button(this.ctx, player.name, 0.33, y, 
                    colour, cfgText.font.medium, "center", "middle"),
                new Button(this.ctx, player.leftKey ? player.leftKey : "", 0.64, y, 
                    colour, cfgText.font.small, "right", "middle",
                    () => {
                        player.leftKey = null
                        this.queuedPresses.push({player: player, key: "left"})
                        this.#showFirstQueuedPress()
                    }),
                new Button(this.ctx, player.rightKey ? player.rightKey : "", 0.70, y, 
                    colour, cfgText.font.small, "left", "middle",
                    () => {
                        player.rightKey = null
                        this.queuedPresses.push({player: player, key: "right"})
                        this.#showFirstQueuedPress()
                    }),
            )
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
