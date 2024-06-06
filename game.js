class Game {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Scoreboard} scoreboard
     */
    constructor(ctx, scoreboard) {
        this.ctx = ctx
        this.scoreboard = scoreboard

        /** @type {Player[]} */
        this.players = []
        for (let i = 0; i < Config.defaultPlayers.keys.length; i++) {
            const settings = Config.defaultPlayers.settings[i];
            const keys = Config.defaultPlayers.keys[i];
            const player = new Player(settings.name, settings.colour)
            player.leftKey = keys.left
            player.rightKey = keys.right
            this.players.push(player)
        }

        /** @type {Obstacle[]} */
        this.obstacles = []

        /** @type {State} */
        this.state = null
        this.setState(StartScreen)

        /** @type {number} */
        this.borderUnactiveCount = 0
    }

    /**
     * 
     * @param {(game: Game) => State} newState 
     */
    setState(newState) {
        this.state = new newState(this)
    }

    /**
     * @param {KeyboardEvent} event 
     */
    keyHandler(event) {
        this.state.keyHandler(event)
    }

    /**
     * @param {MouseEvent} event 
     */
    mouseHandler(event) {
        if (event.repeat) return
        const transform = this.ctx.getTransform()
        this.state.mouseHandler(event, event.pageX/transform.a, event.pageY/transform.d)
    }

    resizeHandler() { this.state.render(this) }

    render() {
        this.ctx.clearRect(0, 0, 1, 1)
        this.state.render()
    }

    /**
     * 
     * @param {number} opacity 
     */
    renderBorder(opacity) {
        const borderConfig = Config.gameplay.border
        const w = borderConfig.width

        const prevOpacity = this.ctx.globalAlpha
        this.ctx.fillStyle = borderConfig.colour
        this.ctx.globalAlpha = opacity
        this.ctx.fillRect(0, 0, 1, w)
        this.ctx.fillRect(0, 1-w, 1, w)
        this.ctx.fillRect(0, w, w, 1-2*w)
        this.ctx.fillRect(1-w, w, w, 1-2*w)
        this.ctx.globalAlpha = prevOpacity
    }

    renderPlayers() {
        for (const player of this.players) {
            this.ctx.fillStyle = player.colour
            this.ctx.beginPath()
            this.ctx.arc(player.position[0], player.position[1], player.width, 0, 2*Math.PI, true)
            this.ctx.closePath()
            if (player.invincibilityCount > 0) {
                this.ctx.arc(player.position[0], player.position[1], player.width / 2, 0, 2*Math.PI, false)
                this.ctx.closePath()
            }
            this.ctx.fill()
        }
    }

    renderObstacles() {
        for (const obstacle of this.obstacles) {
            if (obstacle.length == 0) continue

            this.ctx.fillStyle = obstacle.colour
            this.ctx.beginPath()
            // this.ctx.arc(obstacle.position[0], obstacle.position[1], obstacle.width, 0, 2*Math.PI)
            this.ctx.moveTo(...obstacle.getPoint(0, 1))
            for (let i = 1; i < obstacle.length; i++) this.ctx.lineTo(...obstacle.getPoint(i, 1))
            for (let i = obstacle.length-1; i >= 0; i--) this.ctx.lineTo(...obstacle.getPoint(i, -1))
            this.ctx.closePath()
            this.ctx.fill()
        }
    }
}


class State {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        this.game = game
    }

    get ctx() {
        return this.game.ctx
    }

    /**
     * @typedef {(event: KeyboardEvent) => void} KeyHandler
     * @type {KeyHandler}
     */
    keyHandler() { console.error("calling keyHandler without override") }

    /**
     * @typedef {(event: MouseEvent, x: number, y: number) => void} MouseHandler
     * @type {MouseHandler}
     */
    mouseHandler() { console.error("calling mouseHandler without override") }

    /**
     * 
     */
    render() { console.error("calling render without override") }
}


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

        this.buttons = [new Button(this.ctx, "Add Player", 0.33, 0.85, 
                Config.text.colour, Config.text.font.medium, "center", "middle",
                this.addPlayer.bind(this)),
            new Button(this.ctx, "Start Game", 0.67, 0.85, 
                Config.text.colour, Config.text.font.medium, "center", "middle",
                () => this.game.setState(PreRound))]
        this.#recreatePlayerButtons()
        for (const player of this.game.players) player.score = 0
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (event.code === Config.continueGameKey && event.type === "keyup") {
            if (this.queuedPresses.length > 0) return
            this.game.setState(PreRound)
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
        this.game.renderBorder(1)

        for (const button of this.buttons) button.render()
        // SelfWidthBoost.render(this.ctx, 0.5, 0.5)
    }

    #recreatePlayerButtons() {
        const players = this.game.players
        this.buttons = this.buttons.slice(0, 2)

        for (const [idx, player] of players.entries()) {
            const y = 0.13+0.07*idx

            this.buttons.push(
                new Button(this.ctx, "X", 0.1, y, 
                    player.colour, Config.text.font.small, "left", "middle", 
                    () => {
                        players.splice(players.indexOf(player), 1)
                        this.#recreatePlayerButtons()
                    }),
                new Button(this.ctx, player.name, 0.33, y, 
                    player.colour, Config.text.font.medium, "center", "middle"),
                new Button(this.ctx, player.leftKey ? player.leftKey : "", 0.64, y, 
                    player.colour, Config.text.font.small, "right", "middle",
                    () => {
                        player.leftKey = null
                        this.queuedPresses.push({player: player, key: "left"})
                        this.#showFirstQueuedPress()
                    }),
                new Button(this.ctx, player.rightKey ? player.rightKey : "", 0.70, y, 
                    player.colour, Config.text.font.small, "left", "middle",
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
        const playerSettings = Config.defaultPlayers.settings

        if (this.game.players.length >= playerSettings.length) return
        const takenNames = this.game.players.map(p => p.name)
        let idx = -1
        for (let i = 0; i < playerSettings.length; i++) {
            const name = playerSettings[i].name;
            if (takenNames.indexOf(name) < 0) {
                idx = i
                break
            }
        }

        const newPlayer = new Player(playerSettings[idx].name, playerSettings[idx].colour)
        this.game.players.push(newPlayer)
        this.queuedPresses.push({player: newPlayer, key: "left"}, {player: newPlayer, key: "right"})
        this.#showFirstQueuedPress()
    }
}


/**
 * 
 * @extends State
 */
class PreRound extends State {

    /** @type {number} */
    countdown

    constructor(game) {
        super(game)

        if (this.game.players.length < 2) return new StartScreen(game)

        this.countdown = 3+1
        this.reduceCountdown()

        for (const player of this.game.players) {
            player.isAlive = true
            player.position = [Math.random()*0.8+0.1, Math.random()*0.8+0.1]
            player.currentAngle = Math.random()*2*Math.PI

            player.velocity = Config.gameplay.player.velocity
            player.angularVelocity = Config.gameplay.player.angularVelocity
            player.width = Config.gameplay.player.width
        }
        this.game.scoreboard.updateScores(this.game.players, 0)
        this.game.scoreboard.showScoreboard()

        this.game.borderUnactiveCount = 0
        for (const player of this.game.players) {
            player.invincibilityCount = 0
            player.keyDirections = 1
        }
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        const isPress = event.type === "keydown"
        for (const player of this.game.players) {
            if (event.code == player.leftKey) player.isLeftPressed = isPress
            if (event.code == player.rightKey) player.isRightPressed = isPress
        }
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder(1)
        this.game.renderPlayers()

        this.ctx.font = Config.text.font.huge
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillStyle = Config.text.colour
        this.ctx.fillText(this.countdown.toString(), 0.5, 0.5)
    }

    reduceCountdown() {
        if (this.countdown > 1) {
            setTimeout(this.reduceCountdown.bind(this), 1000)
            this.countdown--
        } else {
            this.game.setState(InRound)
        }
    }
}


/**
 * 
 * @extends State
 */
class InRound extends State {
    
    /** @type {number|null} */
    interval = null
    /** @type {number} */
    trailTicks = 0

    /** @type {PowerupManager} */
    #powerupManager

    constructor(game) {
        super(game)

        this.game.obstacles = []

        this.interval = setInterval(() => this.mainloop(game), 1000/Config.gameplay.UPS)
        this.trailTicks = 0

        this.#powerupManager = new PowerupManager(this.game, (t) => 5.5*60*(Math.cos(2*Math.PI*t/(60*60*2)) + 1) + 30)
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        const isPress = event.type === "keydown"
        for (const player of this.game.players) {
            if (event.code == player.leftKey) player.isLeftPressed = isPress
            if (event.code == player.rightKey) player.isRightPressed = isPress
        }
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        // TODO: make border flash
        this.game.renderBorder(this.game.borderUnactiveCount === 0 ? 1 : 0)
        this.game.renderObstacles()
        this.game.renderPlayers()
        this.#powerupManager.render()
    }

    mainloop() {
        if (this.trailTicks == Config.gameplay.trailOnTicks) {
            this.endTrail(this.game)
            this.trailTicks = -Config.gameplay.trailOffTicks
        } else if (this.trailTicks == 0) {
            this.startTrail(this.game)
        }
        this.trailTicks++

        for (const player of this.game.players) player.move()

        const borderWidth = Config.gameplay.border.width
        /** @type {number} */
        let justDied = 0
        for (const player of this.game.players) {
            if (!player.isAlive) continue
            if (this.game.borderUnactiveCount === 0) {
                if ((player.position[0] < player.width+borderWidth) || 
                    (1-player.position[0] < player.width+borderWidth) || 
                    (player.position[1] < player.width+borderWidth) || 
                    (1-player.position[1] < player.width+borderWidth)) {
                    
                    player.isAlive = false
                    justDied++
                    continue
                }
            } else {
                if (player.position[0] < 0) {
                    player.position[0] += 1
                    this.#startTrailForPlayer(player)
                }
                if (player.position[0] > 1) {
                    player.position[0] -= 1
                    this.#startTrailForPlayer(player)
                }
                if (player.position[1] < 0) {
                    player.position[1] += 1
                    this.#startTrailForPlayer(player)
                }
                if (player.position[1] > 1) {
                    player.position[1] -= 1
                    this.#startTrailForPlayer(player)
                }
            }
            if (player.invincibilityCount === 0) {
                for (const obstacle of this.game.obstacles) {
                    if (obstacle.doesPlayerCollide(player)) {
                        player.isAlive = false
                        justDied++
                        break
                    }
                }
            }
        }
        game.scoreboard.updateScores(this.game.players, justDied)

        for (const obstacle of this.game.obstacles) obstacle.activatePoints()

        let aliveCount = 0
        for (const player of this.game.players) if (player.isAlive) aliveCount++
        if (aliveCount <= 1) {
            if (this.interval) clearInterval(this.interval)
            this.game.setState(EndRound)
        }

        this.#powerupManager.update()
    }

    /** @param {Player} player */
    #startTrailForPlayer(player) {
        player.currentObstacle = new Obstacle(Config.gameplay.player.obstacleFraction * player.width, player)
        this.game.obstacles.push(player.currentObstacle)
    }

    startTrail() {
        for (const player of this.game.players) {
            if (!player.isAlive) continue
            this.#startTrailForPlayer(player)
        }
    }

    endTrail() {
        for (const player of this.game.players) player.currentObstacle = null
    }
}


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

        if ((this.game.players.length-1)*5 <= topScore) return new EndScreen(game)
    }

    /** @type {KeyHandler} */
    keyHandler(event) {
        if (event.code === Config.continueGameKey && event.type === "keyup") this.game.setState(PreRound)

        const isPress = event.type === "keydown"
        for (const player of this.game.players) {
            if (event.code == player.leftKey) player.isLeftPressed = isPress
            if (event.code == player.rightKey) player.isRightPressed = isPress
        }
    }

    /** @type {MouseHandler} */
    mouseHandler() {}

    render() {
        this.game.renderBorder(1)
        this.game.renderObstacles()
        this.game.renderPlayers()

        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"
        this.ctx.fillStyle = Config.text.colour
        this.ctx.font = Config.text.font.large
        this.ctx.fillText(`Press ${Config.continueGameKey} to continue`, 0.5, 0.5)
        if (this.#lastAlive) {
            this.ctx.fillStyle = this.#lastAlive.colour
            this.ctx.font = Config.text.font.medium
            this.ctx.fillText(`${this.#lastAlive.name} won the round`, 0.5, 0.6)
        }
    }
}


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
