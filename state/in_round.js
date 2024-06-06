
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
